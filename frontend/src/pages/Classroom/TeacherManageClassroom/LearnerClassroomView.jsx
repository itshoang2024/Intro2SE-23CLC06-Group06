import { useState } from "react";
import { VocabularyListCard, ClassroomTitle } from "../../../components";

const tabs = [
    { name: "To-Review" },
    { name: "Reviewed" },
    { name: "Overdue" }
];

const dummyLists = Array(8).fill({
    title: "IELTS Academy",
    description: "A helpful list of commonly used English words to boost your reading and speaking skills",
    username: "nguyenhoangphihung@gmail.com",
    role: "Teacher",
    reviewProgress: "2/5",
    completionDate: "Aug, 28th, 2025",
    result: "80%"
});

export default function LearnerClassroomView() {
    const [activeTab, setActiveTab] = useState("To-Review");

    // Handle fetching assignments for learner
    // const [isLoading, setIsLoading] = useState(false);
    // const [assignments, setAssignments] = useState([]);

    // useEffect(() => {
    //     if (!classroomId || isLoading) {
    //         return;
    //     }

    //     const fetchAssignments = async () => {
    //         setIsLoading(true);
    //         try {
    //             let res;
    //             switch (activeTab) {
    //                 case "To-Review":
    //                     res = await classroomService.getToReviewAssignments(classroomId);
    //                     break;
    //                 case "Reviewed":
    //                     res = await classroomService.getReviewedAssignments(classroomId);
    //                     break;
    //                 default:
    //                     res = await classroomService.getOverdueAssignments(classroomId);
    //             }

    //             if (res.success && Array.isArray(res.data)) {
    //                 setAssignments(res.data);
    //                 console.log("Fetch assignments successful");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching assignments:", error);
    //             navigate("/fail");
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchAssignments();

    // }, [activeTab, classroomId]);

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
                <span>All lists: 12</span>
                <div className="filter">Filter by ▼</div>
            </div>

            {/* List Grid */}
            {activeTab === "To-Review" ? (
                <div className="list-grid">
                    {dummyLists.map((list, index) => (
                        <VocabularyListCard
                            key={index}
                            {...list}
                        />
                    ))}
                </div>
            ) : activeTab === "Reviewed" ? (
                <div className="list-grid">
                    {dummyLists.map((list, index) => (
                        <VocabularyListCard
                            key={index}
                            {...list}
                        />
                    ))}
                </div>
            ) : (
                <div className="list-grid">
                    {dummyLists.map((list, index) => (
                        <VocabularyListCard
                            key={index}
                            {...list}
                        />
                    ))}
                </div>
            )}

            {/* See more */}
            <div className="see-more">
                <button className="btn see-more-btn">See more ▼</button>
            </div>
        </div>
    );
}