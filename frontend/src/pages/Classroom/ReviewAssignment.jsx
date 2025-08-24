import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer, Header, SideBar } from "../../components";
import classroomService from "../../services/Classroom/classroomService";
import { useToast } from "../../components/Providers/ToastProvider.jsx";
import { useLocation } from "react-router-dom";
import reviewService from "../../services/Review/reviewService";
import { useNavigate } from "react-router-dom";

export default function ReviewAssignment() {
  const { classroomId, assignmentId, listId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [listInfo, setListInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { title, method, username } = location.state || {};


  

  useEffect(() => {
    async function fetchAssignmentInfo() {
      try {
        setLoading(true);
        // Gọi API lấy thông tin assignment/sublist, bao gồm vocab_list và phương pháp học
        const info = await classroomService.getListToReviewAssignments(
            classroomId,
            assignmentId,
            listId
        );
        setListInfo({
          title: info.data.title,
          exerciseMethod: method,
          wordCount: info.data.word_count,
          creator: username,
          // Thêm các trường khác nếu cần
        });
      } catch (err) {
        setError("Failed to load assignment info");
        toast("Failed to load assignment info", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchAssignmentInfo();
  }, [classroomId, assignmentId, listId, toast]);

  if (loading) return <div>Loading...</div>;
  if (error || !listInfo) return <div>{error || "No data"}</div>;

  const handleStartReview = async () => {
    try {
      console.log(
        "Starting review for listId:",
        listId,
        "method:",
        method
      );

      // Navigate directly for specific methods without session
      if (method === "Flashcard") {
        navigate(`/review/${listId}/flashcard`, {
          state: { method, listInfo },
        });
        return;
      } else if (method === "Fill in the blank") {
        navigate(`/review/${listId}/fill-in-blank`, {
          state: { method, listInfo },
        });
        return;
      }

      // For other methods, start a review session
      // Map frontend method names to backend sessionType values
      let sessionType = method;

      const requestData = { listId, sessionType };
      console.log("Request data:", requestData);

      let sessionResponse;
      try {
        sessionResponse = await reviewService.startSession(requestData);
        console.log("Session response:", sessionResponse);

        // Check if backend automatically switched to practice mode
        if (sessionResponse.session.practiceMode && !requestData.practiceMode) {
          toast(
            "No due words found. Starting practice mode with all words.",
            "success"
          );
        }
      } catch (error) {
        console.log("Error starting session:", error);
        console.log("Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
        });

        // If no words in list at all, offer practice mode choice
        const isNoWordsError =
          error.message?.includes("has no words to practice") ||
          error.response?.data?.message?.includes("has no words to practice");

        if (isNoWordsError) {
          toast("This list has no words to practice.", "error");
          return;
        } else {
          throw error; // Re-throw if it's a different error
        }
      }

      // Navigate to the actual review interface
      navigate(`/review/session/${sessionResponse.session.sessionId}`, {
        state: { method, listInfo },
      });
    } catch (err) {
      console.error("Error starting review session:", err);
      toast("Failed to start review session", "error");
    }
  };
  
  return (
    <div className="review">
      <Header />
      <h1 className="review__title">Classroom Assignment Review</h1>
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="review__content">
        <div className="review__main">
          <div className="review__header">
            <div className="review__list-title">{listInfo.title}</div>
            <div className="review__creator">
              <div>
                Created by: {listInfo.creator || "Unknown"}
              </div>
            </div>
          </div>
          <div className="review__information">
            <div className="stats">
              <div className="sub-title">Total words:</div>
              <div className="sub-content">
                {listInfo.wordCount || 0} words
              </div>
            </div>
          </div>
          <div className="review__information">
            <div className="stats">
              <div className="sub-title">Method:</div>
              <div className="sub-content">
                {listInfo.exerciseMethod}
              </div>
            </div>
          </div>
          <div className="review__start">
            <button
              className="review__start-button"
              onClick={handleStartReview}
            >
              Start Review Session
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}