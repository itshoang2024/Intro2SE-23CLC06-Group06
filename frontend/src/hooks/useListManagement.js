import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Providers/ToastProvider.jsx';
import vocabularyService from '../services/Vocabulary/vocabularyService';
import { validateCreateListForm } from '../utils/createListValidation.js';

export const useListManagement = (listId, validationHook, wordManagementHook) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { setErrors } = validationHook;
  const { prepareWordsForSubmission, getValidWords, setWords } = wordManagementHook;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await vocabularyService.getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    validationHook.clearFieldError('title');
  }, [validationHook]);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
    validationHook.clearFieldError('description');
  }, [validationHook]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const words = getValidWords();
    const validation = validateCreateListForm(title, description, words);
    setErrors(validation.errors);

    if (!validation.isValid) {
      toast("Please fix the validation errors before submitting.", "error");
      return;
    }

    const listData = {
      title,
      description,
      privacy_setting: privacy,
      tags: selectedTags,
    };

    try {
      let actualListId = listId;
      let createdList;

      // Create or update list
      if (!actualListId) {
        const res = await vocabularyService.createList(listData);
        createdList = res?.data?.list;
        if (!createdList?.id) {
          throw new Error("Failed to create new list");
        }
        actualListId = createdList.id;
      } else {
        await vocabularyService.updateList(actualListId, listData);
        createdList = { id: actualListId };
      }

      // Add words if any exist
      if (words.length > 0) {
        const wordPayload = {
          listId: actualListId,
          words: prepareWordsForSubmission(),
        };

        await vocabularyService.createWordsBulk(wordPayload);

        // Fetch and update words with IDs
        const insertedWords = await vocabularyService.getWordsByListId(createdList.id);
        const updatedWords = words.map((w, i) => ({
          ...w,
          id: insertedWords[i]?.id || null,
        }));
        setWords(updatedWords);
      }

      toast("List created successfully!", "success");
      setTimeout(() => navigate("/vocabulary"), 2000);
    } catch (err) {
      console.error("Error creating list:", err);
      toast("Failed to create list. Please try again.", "error");
    }
  }, [
    title,
    description,
    privacy,
    selectedTags,
    listId,
    getValidWords,
    prepareWordsForSubmission,
    setErrors,
    setWords,
    toast,
    navigate,
  ]);

  return {
    title,
    description,
    privacy,
    selectedTags,
    availableTags,
    setTitle,
    setDescription,
    setPrivacy,
    setSelectedTags,
    handleTitleChange,
    handleDescriptionChange,
    handleSubmit,
  };
};