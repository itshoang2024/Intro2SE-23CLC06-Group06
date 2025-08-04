import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SideBar, Footer } from "../../components";
import reviewService from "../../services/Review/reviewService";
import { useToast } from "../../components/Providers/ToastProvider.jsx";
import MainPageLogo from "../../assets/Logo.svg";
import { SummaryBackground } from "../../assets/Review/index.jsx";

export default function SessionSummary() {
  const { sessionId, listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSessionSummary() {
      try {
        setLoading(true);
        
        // If summary is passed through navigation state, use it
        if (location.state?.summary) {
          console.log("Received summary data:", location.state.summary); // Debug log
          setSummary(location.state.summary);
          setLoading(false);
          return;
        }

        // Otherwise, fetch the session summary from the backend
        // This would typically happen if user refreshes the page
        if (sessionId) {
          // Note: This would require a new endpoint to get completed session summary
          // For now, we'll show a generic message
          setError("Session summary not available. Please start a new review session.");
        } else {
          setError("No session information available.");
        }
      } catch (err) {
        console.error("Error fetching session summary:", err);
        setError("Failed to load session summary");
        toast("Failed to load session summary", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchSessionSummary();
  }, [sessionId, location.state, toast]);

  const handleContinueReviewing = async () => {
    try {
      // Try to start a new review session directly
      const sessionResponse = await reviewService.startSession({
        listId: listId || summary?.listId,
        sessionType: 'flashcard'
      });
      
      // If successful, navigate directly to the flashcard session
      navigate(`/review/session/${sessionResponse.session.sessionId}`, {
        state: { method: 'Flashcards', listInfo: summary?.listInfo }
      });
    } catch (error) {
      // If no due words, offer practice mode
      if (error.message?.includes('No words are currently due for review')) {
        const confirmed = window.confirm(
          "No words are currently due for review. Would you like to start practice mode instead?"
        );
        if (confirmed) {
          try {
            const practiceResponse = await reviewService.startSession({
              listId: listId || summary?.listId,
              sessionType: 'flashcard',
              practiceMode: true
            });
            
            navigate(`/review/session/${practiceResponse.session.sessionId}`, {
              state: { method: 'Flashcards', listInfo: summary?.listInfo }
            });
            toast("Starting practice mode with all words.", "info");
          } catch (practiceError) {
            console.error("Error starting practice session:", practiceError);
            toast("Failed to start practice session", "error");
          }
        }
      } else {
        console.error("Error starting review session:", error);
        toast("Failed to start review session", "error");
      }
    }
  };

  const handleBackToList = () => {
    // Navigate back to the vocabulary list
    navigate(`/vocabulary/view/${listId || summary?.listId}`);
  };

  const calculateAccuracyPercentage = () => {
    if (!summary || !summary.totalWords || summary.totalWords === 0) return 0;
    const total = parseInt(summary.totalWords) || 0;
    const correct = parseInt(summary.correctAnswers) || 0;
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };  

  const getAccuracyColor = () => {
    const percentage = calculateAccuracyPercentage();
    if (percentage >= 80) return "#30B237"; // Green
    if (percentage >= 60) return "#ffc310ff"; // Yellow
    return "#db1e31ff"; // Red
  };

  if (loading) {
    return (
      <div className="session-summary"
        style={{
        backgroundImage: `url(${SummaryBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="session-summary__content">
          <SideBar />
          <main className="session-summary__main">
            <div className="loading">Loading session summary...</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="session-summary"
        style={{
        backgroundImage: `url(${SummaryBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
          <div className="session-summary__content">
          <SideBar />
          <main className="session-summary__main">
            <div className="session-summary__container">
              <div className="error">
                {error || "Session summary not available"}
              </div>
              <button 
                className="session-summary__button session-summary__button--primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const accuracyPercentage = calculateAccuracyPercentage();

  return (
      <div className="session-summary"
        style={{
        backgroundImage: `url(${SummaryBackground})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="session-summary__content">
        <SideBar />
        <main className="session-summary__main">
          <div className="session-summary__container">
            <img src={MainPageLogo} alt="Logo" className="session-summary__logo" />
            <div className="session-summary__header">
              <h1 className="session-summary__title">Session summary</h1>
              <p className="session-summary__subtitle">
                Congratulations! You reviewed all of your vocabulary
              </p>
            </div>

            <div className="session-summary__stats">
              <div className="session-summary__stat-card">
                <div className="session-summary__check-icon">
                  <div className="session-summary__check-circle">
                    <svg viewBox="0 0 24 24" className="session-summary__check-mark">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
                <div className="session-summary__stat-info">
                  <div className="session-summary__stat-label">Accuracy</div>
                  <div 
                    className="session-summary__stat-value"
                    style={{ color: getAccuracyColor() }}
                  >
                    {accuracyPercentage}%
                  </div>
                  <div className="session-summary__stat-label">Reviewed words</div>
                  <div className="session-summary__stat-value session-summary__stat-value--blue">
                    {summary.totalWords || 0}
                  </div>
                </div>
              </div>

              <div className="session-summary__accuracy-circle">
                <svg className="session-summary__circle-chart" viewBox="0 0 36 36">
                  <path
                    className="session-summary__circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="session-summary__circle-bar"
                    strokeDasharray={`${accuracyPercentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{ stroke: getAccuracyColor() }}
                  />
                </svg>
                <div className="session-summary__circle-text">
                  {accuracyPercentage}%
                </div>
              </div>
            </div>

            <div className="session-summary__details">
              <div className="session-summary__detail-item">
                <span className="session-summary__detail-label">Total Words:</span>
                <span className="session-summary__detail-value">{summary.totalWords || 0}</span>
              </div>
              <div className="session-summary__detail-item">
                <span className="session-summary__detail-label">Correct Answers:</span>
                <span className="session-summary__detail-value session-summary__detail-value--green">
                  {summary.correctAnswers || 0}
                </span>
              </div>
              <div className="session-summary__detail-item">
                <span className="session-summary__detail-label">Incorrect Answers:</span>
                <span className="session-summary__detail-value session-summary__detail-value--red">
                  {summary.incorrectAnswers || 0}
                </span>
              </div>
              {summary.completedAt && (
                <div className="session-summary__detail-item">
                  <span className="session-summary__detail-label">Completed At:</span>
                  <span className="session-summary__detail-value">
                    {new Date(summary.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="session-summary__actions">
              <button 
                className="session-summary__button session-summary__button--secondary"
                onClick={handleBackToList}
              >
                Back to List
              </button>
              {/* <button 
                className="session-summary__button session-summary__button--primary"
                onClick={handleContinueReviewing}
              >
                Continue Reviewing
              </button> */}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}