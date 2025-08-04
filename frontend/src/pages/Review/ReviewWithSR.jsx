import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, SideBar, Footer } from "../../components";
import reviewService from "../../services/Review/reviewService";
import vocabularyService from "../../services/Vocabulary/vocabularyService";
import { useToast } from "../../components/Providers/ToastProvider.jsx";
import { useConfirm } from "../../components/Providers/ConfirmProvider.jsx";
import { DropdownIcon } from "../../assets/Vocabulary/index.jsx";

export default function ReviewWithSR() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [listInfo, setListInfo] = useState(null);
  const [reviewMethod, setReviewMethod] = useState("Flashcard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewMethods = ["Flashcard", "Fill in the blank", "Word Association"];

  useEffect(() => {
    async function fetchListInfo() {
      try {
        setLoading(true);
        const info = await vocabularyService.getListById(listId);
        setListInfo(info);
      } catch (err) {
        console.error("Error fetching list info:", err);
        setError("Failed to load vocabulary list");
        toast("Failed to load vocabulary list", "error");
      } finally {
        setLoading(false);
      }
    }

    if (listId) {
      fetchListInfo();
    }
  }, [listId, toast]);

  const handleStartReview = async () => {
    try {
      // For flashcards method, navigate directly to flashcard study
      if (reviewMethod === "Flashcard") {
        navigate(`/review/${listId}/flashcard`, {
          state: { method: reviewMethod, listInfo }
        });
        return;
      }

      // For other methods, start a review session
      // Map frontend method names to backend sessionType values
      let sessionType;
      switch (reviewMethod) {
        case "Fill in the blank":
          sessionType = "fill_blank";
          break;
        case "Word Association":
          sessionType = "word_association";
          break;
        default:
          sessionType = "flashcard";
      }

      let sessionResponse;
      try {
        sessionResponse = await reviewService.startSession({
          listId: listId,
          sessionType: sessionType,
        });
      } catch (error) {
        console.log("Error starting session:", error);
        // If no due words, offer practice mode
        // Check multiple possible error message formats
        const isNoDueWordsError = 
          error.message?.includes('No words are currently due for review') ||
          error.response?.data?.message?.includes('No words are currently due for review') ||
          error.response?.status === 404;
        
        if (isNoDueWordsError) {
          const confirmed = await confirm(
            "There's no words to review, do you want to continue to review?"
          );
          if (confirmed) {
            sessionResponse = await reviewService.startSession({
              listId: listId,
              sessionType: sessionType,
              practiceMode: true
            });
            toast("Starting practice mode with all words.", "info");
          } else {
            toast("No review session started.", "info");
            return;
          }
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
      
      // Navigate to the actual review interface
      navigate(`/review/session/${sessionResponse.session.sessionId}`, {
        state: { method: reviewMethod, listInfo }
      });
    } catch (err) {
      console.error("Error starting review session:", err);
      toast("Failed to start review session", "error");
    }
  };

  if (loading) {
    return (
      <div className="review">
        <Header />
        <h1 className="review__title">Review with Spaced Repetition</h1>
        <SideBar />
        <div className="review__content">
          <div className="review__main">
            <p>Loading list information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listInfo) {
    return (
      <div className="review">
        <Header />
        <h1 className="review__title">Review with Spaced Repetition</h1>
        <SideBar />
        <div className="review__content">
          <div className="review__main">
            <p className="error">
              {error || "Vocabulary list not found"}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="review">
      <Header />
      <h1 className="review__title">Review with Spaced Repetition</h1>
      <SideBar />
      <div className="review__content">
        <div className="review__main">
          <div className="review__header">
            <div className="review__list-title">{listInfo.title}</div>

            {listInfo.tags && listInfo.tags.length > 0 && (
              <div className="review__tags">
                {listInfo.tags.map((tag, index) => (
                  <span key={index} className="review__tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="review__creator">
              <div>Created by: {listInfo.created_by?.full_name || "Unknown"}</div>
            </div>
          </div>

          <div className="review__information">
            <div className='sub-title'>Description</div> 
            <div className='sub-content'>{listInfo.description || "No description available"}</div>
            <div className='stats'>
              <div className='sub-title'>Total words:</div> 
              <div className='sub-content'>{listInfo.word_count || 0} words</div>
            </div>
          </div>

          <div className="review__methods">
            <div className="review__information">
              <div className='sub-title'>Method:</div>
            </div>
            <div className="review__dropdownWrapper">
              <select 
                value={reviewMethod} 
                onChange={(e) => setReviewMethod(e.target.value)}
              >
                {reviewMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <img src={DropdownIcon} alt="DropdownIcon" className="dropdown__icon"/>
            </div>
          </div>

          <div className="review__start">
            <button className="review__start-button" onClick={handleStartReview}>
              Start Review Session    
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}