const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeAI();
  }

  initializeAI() {
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-001';
    try {
      this.genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: this.model,
      });
      // Add a small delay between requests to avoid rate limiting
      this.lastRequestTime = 0;
      this.minRequestInterval = 500; // 500ms between requests
      logger.info(`Google Gemini AI initialized with model: ${this.model}`);
    } catch (error) {
      logger.error('Failed to initialize Google Gemini AI:', error);
      this.genAI = null;
    }
  }

  isAvailable() {
    return this.genAI !== null;
  }

  async generateExample(word, definition, context = null) {
    if (!this.genAI) {
      throw new Error('AI service is not available');
    }

    const maxRetries = 3;
    const retryDelay = 1000; // Start with 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Rate limiting to prevent too many rapid requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
          );
        }

        const prompt = this._buildExamplePrompt(word, definition, context);

        const response = await this.genAI.models.generateContent({
          model: this.model,
          contents: prompt,
        });
        const example = response.text;

        logger.info(`Generated example for word: ${word}`);
        this.lastRequestTime = Date.now();
        return example;
      } catch (error) {
        const isOverloaded =
          error.message?.includes('overloaded') ||
          error.status === 'UNAVAILABLE' ||
          error.code === 503;

        if (isOverloaded && attempt < maxRetries) {
          const waitTime = retryDelay * attempt;
          logger.warn(
            `AI model overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        logger.error(
          `Failed to generate example (attempt ${attempt}/${maxRetries}):`,
          error
        );

        // Provide user-friendly error message
        if (isOverloaded) {
          throw new Error(
            'AI service is currently busy. Please try again in a few moments.'
          );
        }
        throw new Error('Failed to generate example sentence');
      }
    }
  }

  async generateMissingFields(word, definition, currentData = {}, context = null) {
    if (!this.genAI) {
      throw new Error('AI service is not available');
    }

    const maxRetries = 3;
    const retryDelay = 1000; // Start with 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Rate limiting to prevent too many rapid requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
          );
        }

        const prompt = this._buildMissingFieldsPrompt(word, definition, currentData, context);
        // console.log('🔍 Missing fields being detected:', this._detectMissingFields(currentData));
        // console.log('📤 AI Prompt:', prompt);

        const response = await this.genAI.models.generateContent({
          model: this.model,
          contents: prompt,
        });
        
        const generatedText = response.text;
        // console.log('📥 Raw AI Response:', generatedText);
        
        const parsedResult = this._parseMissingFieldsResponse(generatedText);
        // console.log('✅ Parsed AI Result:', parsedResult);

        logger.info(`Generated missing fields for word: ${word}`);
        this.lastRequestTime = Date.now();
        return parsedResult;
      } catch (error) {
        const isOverloaded =
          error.message?.includes('overloaded') ||
          error.status === 'UNAVAILABLE' ||
          error.code === 503;

        if (isOverloaded && attempt < maxRetries) {
          const waitTime = retryDelay * attempt;
          logger.warn(
            `AI model overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        logger.error(
          `Failed to generate missing fields (attempt ${attempt}/${maxRetries}):`,
          error
        );

        // Provide user-friendly error message
        if (isOverloaded) {
          throw new Error(
            'AI service is currently busy. Please try again in a few moments.'
          );
        }
        throw new Error('Failed to generate missing fields');
      }
    }
  }

  _buildExamplePrompt(word, definition, context) {
    let prompt = `Generate a clear, natural example sentence using the word "${word}" (definition: ${definition}).`;

    if (context) {
      prompt += ` The sentence should be in the context of ${context}.`;
    }

    prompt += ` Requirements:
    - The sentence should clearly demonstrate the meaning of the word
    - Use simple, everyday language
    - Make it memorable and practical
    - The sentence should be between 10-20 words
    - Only return the example sentence, nothing else`;

    return prompt;
  }

  _buildMissingFieldsPrompt(word, definition, currentData, context) {
    const missingFields = this._detectMissingFields(currentData);
    
    if (missingFields.length === 0) {
      throw new Error('No missing fields to generate');
    }

    let prompt = `For the English word "${word}" (definition: ${definition}), please generate the following missing fields:\n\n`;
    
    if (missingFields.includes('phonetics')) {
      prompt += `- Phonetics: Provide the IPA phonetic transcription (e.g., /ˈhæpi/ for "happy")\n`;
    }
    if (missingFields.includes('synonyms')) {
      prompt += `- Synonyms: Provide 2-4 common synonyms separated by commas\n`;
    }
    if (missingFields.includes('translation')) {
      prompt += `- Translation: Provide the Vietnamese translation\n`;
    }
    if (missingFields.includes('exampleSentence')) {
      prompt += `- Example Sentence: Provide a clear, natural example sentence (10-20 words)\n`;
    }

    if (context) {
      prompt += `\nContext: ${context}\n`;
    }

    prompt += `\nFormat your response as JSON:
{
  ${missingFields.includes('phonetics') ? '"phonetics": "/phonetic-transcription/",' : ''}
  ${missingFields.includes('synonyms') ? '"synonyms": ["synonym1", "synonym2", "synonym3"],' : ''}
  ${missingFields.includes('translation') ? '"translation": "Vietnamese translation",' : ''}
  ${missingFields.includes('exampleSentence') ? '"exampleSentence": "Example sentence using the word"' : ''}
}

Only include the fields that are missing. Return only valid JSON, no additional text.`;

    return prompt;
  }

  _detectMissingFields(currentData) {
    const missingFields = [];
    
    console.log('🔍 Detecting missing fields from data:', currentData);
    
    if (!currentData.phonetics || currentData.phonetics.trim() === '') {
      console.log('❌ phonetics is missing:', currentData.phonetics);
      missingFields.push('phonetics');
    } else {
      console.log('✅ phonetics has value:', currentData.phonetics);
    }
    
    if (!currentData.synonyms || currentData.synonyms.length === 0) {
      console.log('❌ synonyms is missing:', currentData.synonyms);
      missingFields.push('synonyms');
    } else {
      console.log('✅ synonyms has value:', currentData.synonyms);
    }
    
    if (!currentData.translation || currentData.translation.trim() === '') {
      console.log('❌ translation is missing:', currentData.translation);
      missingFields.push('translation');
    } else {
      console.log('✅ translation has value:', currentData.translation);
    }
    
    if (!currentData.exampleSentence || currentData.exampleSentence.trim() === '') {
      console.log('❌ exampleSentence is missing:', currentData.exampleSentence);
      missingFields.push('exampleSentence');
    } else {
      console.log('✅ exampleSentence has value:', currentData.exampleSentence);
    }

    console.log('🎯 Final missing fields detected:', missingFields);
    return missingFields;
  }

  _parseMissingFieldsResponse(responseText) {
    try {
      // Clean up the response text
      let cleanedText = responseText.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse JSON
      const parsed = JSON.parse(cleanedText);
      
      // Validate and clean the parsed data
      const result = {};
      
      if (parsed.phonetics && typeof parsed.phonetics === 'string') {
        result.phonetics = parsed.phonetics.trim();
      }
      
      if (parsed.synonyms && Array.isArray(parsed.synonyms)) {
        result.synonyms = parsed.synonyms
          .filter(s => typeof s === 'string' && s.trim() !== '')
          .map(s => s.trim());
      }
      
      if (parsed.translation && typeof parsed.translation === 'string') {
        result.translation = parsed.translation.trim();
      }
      
      if (parsed.exampleSentence && typeof parsed.exampleSentence === 'string') {
        result.exampleSentence = parsed.exampleSentence.trim();
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      logger.error('Raw response:', responseText);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }
}

module.exports = new AIService();
