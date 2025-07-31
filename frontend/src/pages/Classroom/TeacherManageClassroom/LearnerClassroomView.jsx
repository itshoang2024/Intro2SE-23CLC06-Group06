import { useState, useEffect } from "react";
import { VocabularyListCard, ClassroomTitle } from "../../../components";
import { useNavigate } from "react-router-dom";
import classroomService from "../../../services/Classroom/classroomService";

const tabs = [
    { name: "To-Review" },
    { name: "Reviewed" },
    { name: "Overdue" }
];

export default function LearnerClassroomView() {
    const [activeTab, setActiveTab] = useState("To-Review");
    const [isLoading, setIsLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const navigate = useNavigate();

    // Get classroom ID from localStorage
    const [classroomId] = useState(() => {
        const selectedClassroom = JSON.parse(localStorage.getItem("selectedClassroom"));
        return selectedClassroom?.id || null;
    });

    useEffect(() => {
        if (!classroomId) {
            console.error("Missing classroom ID");
            return;
        }

        const fetchAssignments = async () => {
            setIsLoading(true);
            try {
                let res;
                switch (activeTab) {
                    case "To-Review":
                        res = await classroomService.getToReviewAssignments(classroomId);
                        break;
                    case "Reviewed":
                        res = await classroomService.getReviewedAssignments(classroomId);
                        break;
                    case "Overdue":
                        res = await classroomService.getOverdueAssignments(classroomId);
                        break;
                    default:
                        setAssignments([]);
                        setIsLoading(false);
                        return;
                }

                if (res.success && Array.isArray(res.data)) {
                    setAssignments(res.data);
                    console.log(`Fetch ${activeTab} assignments successful:`, res.data);
                } else {
                    setAssignments([]);
                    console.log(`No ${activeTab} assignments found or invalid response`);
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab} assignments:`, error);
                setAssignments([]);
                // Navigate to error page if it's a critical error, otherwise just show empty state
                if (error.response?.status === 500) {
                    navigate("/fail");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, [activeTab, classroomId, navigate]);

    return (
        <div className="learner-classroom-view">
            {/* Title */}
            <ClassroomTitle />

            {/* Menu tabs */}
            <div className="sub-menu-tabs">
                <div className="tab-list">
                    {tabs.map((tab, idx) => (
                        <div
                            key={idx}
                            className={`tab ${(activeTab === tab.name) ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Bar */}
            <div className="list-topbar">
                <span>All lists: {assignments.length}</span>
                <div className="filter">Filter by ▼</div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner">Loading assignments...</div>
                </div>
            ) : assignments.length === 0 ? (
                <div className="empty-list">
                    No {activeTab.toLowerCase()} assignments available
                </div>
            ) : (
                <div className="list-grid">
                    {assignments.map((assignment, index) => (
                        <VocabularyListCard
                            key={assignment.assignment_id || index}
                            title={assignment.title || "Untitled Assignment"}
                            description={assignment.exercise_method ? `Exercise: ${assignment.exercise_method}` : "No description available"}
                            username="Teacher"
                            role="Teacher"
                            reviewProgress={assignment.completed_sublist_index && assignment.sublist_count 
                                ? `${assignment.completed_sublist_index}/${assignment.sublist_count}` 
                                : "0/0"}
                            completionDate={assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            }) : "No due date"}
                            result={assignment.learner_status === 'completed' ? "Completed" : 
                                   assignment.learner_status === 'in_progress' ? "In Progress" :
                                   assignment.learner_status === 'not_started' ? "Not Started" :
                                   assignment.learner_status || "Unknown"}
                        />
                    ))}
                </div>
            )}

            {/* See more - only show if there are assignments and not loading */}
            {!isLoading && assignments.length > 0 && (
                <div className="see-more">
                    <button className="btn see-more-btn">See more ▼</button>
                </div>
            )}
        </div>
    );
}