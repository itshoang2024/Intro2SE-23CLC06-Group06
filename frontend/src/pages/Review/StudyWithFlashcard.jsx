import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header, SideBar, Footer } from "../../components";
import reviewService from "../../services/Review/reviewService";
import vocabularyService from "../../services/Vocabulary/vocabularyService";
import { useToast } from "../../components/Providers/ToastProvider.jsx";

export default function StudyWithFlashcard() {
  const { sessionId, listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [listInfo, setListInfo] = useState(location.state?.listInfo || null);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  // Cleanup effect to prevent API calls when component unmounts
  useEffect(() => {
    return () => {
      // Mark session as completed when component unmounts to prevent any pending API calls
      setIsSessionCompleted(true);
    };
  }, []);

  useEffect(() => {
    async function initializeStudySession() {
      // Don't initialize if session is already completed
      if (isSessionCompleted) {
        return;
      }
      
      try {
        setLoading(true);
        
        // Get list info if not passed through navigation state
        if (!listInfo && listId) {
          const info = await vocabularyService.getListById(listId);
          setListInfo(info);
        }

        // If sessionId exists, we're continuing a session
        if (sessionId) {
          const sessionStatus = await reviewService.getActiveSessionStatus();
          if (sessionStatus?.activeSession) {
            setSession(sessionStatus.activeSession);
            setWords(sessionStatus.activeSession.remainingWords || []);
          }
        } else {
          // Check for existing active session first
          const activeSessionResponse = await reviewService.getActiveSessionStatus();
          
          if (activeSessionResponse?.activeSession) {
            // End the existing session first
            try {
              await reviewService.endSession(activeSessionResponse.activeSession.sessionId);
            } catch (endError) {
              console.warn("Failed to end existing session:", endError);
              // Continue anyway to try starting new session
            }
          }

          // Start a new session - this will get words automatically
          // First try normal mode (due words only)
          let sessionResponse;
          try {
            sessionResponse = await reviewService.startSession({
              listId: listId || listInfo?.id,
              sessionType: 'flashcard'
            });
          } catch (error) {
            // If no due words, try practice mode (all words)
            if (error.message?.includes('No words are currently due for review')) {
              try {
                sessionResponse = await reviewService.startSession({
                  listId: listId || listInfo?.id,
                  sessionType: 'flashcard',
                  practiceMode: true
                });
                toast("No words due for review. Starting practice mode with all words.", "info");
              } catch (practiceError) {
                throw practiceError; // Re-throw if practice mode also fails
              }
            } else {
              throw error; // Re-throw if it's a different error
            }
          }
          if (sessionResponse?.session) {
            setSession(sessionResponse.session);
            setWords(sessionResponse.session.words || []);
          }
        }

      } catch (err) {
        console.error("Error initializing study session:", err);
        toast("Failed to start study session", "error");
      } finally {
        setLoading(false);
      }
    }

    initializeStudySession();
  }, [sessionId, listId, listInfo, toast, isSessionCompleted]);

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = async (known) => {
    try {
      const currentWord = words[currentWordIndex];
      
      // Submit the result to the backend
      await reviewService.submitResult(session?.sessionId || sessionId, {
        wordId: currentWord.id,
        result: known ? 'correct' : 'incorrect',
        responseTimeMs: Date.now() - (session?.startTime || Date.now())
      });

      // Move to next word or finish session
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setIsFlipped(false);
      } else {
        // End session and get summary
        setIsSessionCompleted(true); // Mark session as completed to prevent further API calls
        const response = await reviewService.endSession(session?.sessionId || sessionId);
        const summary = response.summary || response; // Handle both wrapped and unwrapped responses
        toast("Study session completed!", "success");
        navigate(`/review/${listId || listInfo?.id}/summary`, {
          state: { summary }
        });
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      toast("Error recording response", "error");
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleEndSession = async () => {
    try {
      await reviewService.endSession(session?.sessionId || sessionId);
      navigate(`/review/${listId || listInfo?.id}`);
    } catch (err) {
      console.error("Error ending session:", err);
      toast("Error ending session", "error");
    }
  };

  if (loading) {
    return (
      <div className="study-flashcard">
        <Header />
        <div className="study-flashcard__content">
          <SideBar />
          <main className="study-flashcard__main">
            <div className="loading">Loading study session...</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (!words.length) {
    return (
      <div className="study-flashcard">
        <Header />
        <div className="study-flashcard__content">
          <SideBar />
          <main className="study-flashcard__main">
            <div className="error">No words found for this list</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <div className="study-flashcard">
      <Header />
      <div className="study-flashcard__content">
        <SideBar />
        <main className="study-flashcard__main">
          <div className="study-flashcard__container">
            <div className="study-flashcard__header">
              <h1 className="study-flashcard__title">
                {listInfo?.title || "Flashcard Study"}
              </h1>
              <div className="study-flashcard__progress">
                <span className="study-flashcard__progress-text">
                  {currentWordIndex + 1} of {words.length}
                </span>
                <button 
                  className="study-flashcard__end-button"
                  onClick={handleEndSession}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="study-flashcard__card-container">
              <div className="study-flashcard__navigation">
                <button 
                  className="study-flashcard__nav-button study-flashcard__nav-button--prev"
                  onClick={handlePrevious}
                  disabled={currentWordIndex === 0}
                >
                  ←
                </button>

                <div 
                  className={`study-flashcard__card ${isFlipped ? 'flipped' : ''}`}
                  onClick={handleFlipCard}
                >
                  <div className="study-flashcard__card-content">
                    {!isFlipped ? (
                      <div className="study-flashcard__term">
                        {currentWord.term}
                      </div>
                    ) : (
                      <div className="study-flashcard__definition">
                        <div className="study-flashcard__definition-text">
                          {currentWord.definition}
                        </div>
                        {currentWord.phonetics && (
                          <div className="study-flashcard__phonetics">
                            {currentWord.phonetics}
                          </div>
                        )}
                        {currentWord.examples && currentWord.examples.length > 0 && (
                          <div className="study-flashcard__example">
                            <em>"{currentWord.examples[0].example_sentence}"</em>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="study-flashcard__nav-button study-flashcard__nav-button--next"
                  onClick={handleNext}
                  disabled={currentWordIndex === words.length - 1}
                >
                  →
                </button>
              </div>

              {isFlipped && (
                <div className="study-flashcard__response-buttons">
                  <button 
                    className="study-flashcard__response-button study-flashcard__response-button--unknown"
                    onClick={() => handleResponse(false)}
                  >
                    Unknown
                  </button>
                  <button 
                    className="study-flashcard__response-button study-flashcard__response-button--know"
                    onClick={() => handleResponse(true)}
                  >
                    Know
                  </button>
                </div>
              )}
            </div>

            {!isFlipped && (
              <div className="study-flashcard__instruction">
                Click the card to see the definition
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}