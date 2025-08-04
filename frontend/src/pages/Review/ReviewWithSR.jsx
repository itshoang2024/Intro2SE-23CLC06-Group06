import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, SideBar, Footer } from "../../components";
import reviewService from "../../services/Review/reviewService";
import vocabularyService from "../../services/Vocabulary/vocabularyService";
import { useToast } from "../../components/Providers/ToastProvider.jsx";

export default function ReviewWithSR() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [listInfo, setListInfo] = useState(null);
  const [reviewMethod, setReviewMethod] = useState("Flashcards");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewMethods = ["Flashcards", "Fill in the blanks", "Word Association"];

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
      if (reviewMethod === "Flashcards") {
        navigate(`/review/${listId}/flashcard`, {
          state: { method: reviewMethod, listInfo }
        });
        return;
      }

      // For other methods, start a review session
      // Map frontend method names to backend sessionType values
      let sessionType;
      switch (reviewMethod) {
        case "Fill in the blanks":
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
        // If no due words, offer practice mode
        if (error.message?.includes('No words are currently due for review')) {
          const confirmed = window.confirm(
            "No words are currently due for review based on spaced repetition. Would you like to practice all words instead?"
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
      <div className="review-sr">
        <Header />
        <div className="review-sr__content">
          <SideBar />
          <main className="review-sr__main">
            <div className="loading">Loading...</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listInfo) {
    return (
      <div className="review-sr">
        <Header />
        <div className="review-sr__content">
          <SideBar />
          <main className="review-sr__main">
            <div className="error">
              {error || "Vocabulary list not found"}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="review-sr">
      <Header />
      <div className="review-sr__content">
        <SideBar />
        <main className="review-sr__main">
          <div className="review-sr__container">
            <h1 className="review-sr__title">Review with Spaced Repetition</h1>
            
            <div className="review-sr__card">
              <h2 className="review-sr__list-title">{listInfo.title}</h2>
              
              <div className="review-sr__list-meta">
                <p className="review-sr__difficulty">
                  {listInfo.difficulty} - {listInfo.category}
                </p>
                <p className="review-sr__creator">
                  Created by: {listInfo.created_by?.full_name || "Unknown"}
                </p>
              </div>

              <div className="review-sr__description">
                <h3>Description</h3>
                <p>{listInfo.description || "No description available"}</p>
              </div>

              <div className="review-sr__stats">
                <div className="review-sr__stat">
                  <span className="review-sr__stat-label">Total words:</span>
                  <span className="review-sr__stat-value">{listInfo.word_count || 0} words</span>
                </div>
              </div>

              <div className="review-sr__method">
                <label className="review-sr__method-label">Method:</label>
                <div className="review-sr__method-select">
                  <select 
                    value={reviewMethod} 
                    onChange={(e) => setReviewMethod(e.target.value)}
                    className="review-sr__select"
                  >
                    {reviewMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="review-sr__status">
                <div className="review-sr__status-icon">⏱</div>
                <span className="review-sr__status-text">Ready to review</span>
              </div>

              <button
                className="review-sr__start-button"
                onClick={handleStartReview}
              >
                Start review
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}