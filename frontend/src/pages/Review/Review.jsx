import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer, Header, SideBar } from "../../components/index.jsx";
import reviewService from "../../services/Review/reviewService";
import { DropdownIcon } from "../../assets/Vocabulary/index.jsx";

export default function Dashboard() {
    const [listInfo, setListInfo] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("Flashcards");

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const response = await reviewService.getListsWithDueWords();
    //             const lists = response?.data?.listsWithDueWords || [];

    //             // ⚠️ Giả sử chọn list đầu tiên, và bổ sung mock dữ liệu còn thiếu
    //             if (lists.length > 0) {
    //                 const enriched = {
    //                     ...lists[0],
    //                     creator: {
    //                         display_name: "Thomas Anderson",
    //                     },
    //                     description: "This is a mock description for the list. Practice daily!",
    //                 };
    //                 setListInfo(enriched);
    //             }
    //         } catch (err) {
    //             console.error("Error fetching list info:", err);
    //         }
    //     }
    //     fetchData();
    // }, []);

    useEffect(() => {
        const dummyList = {
            id: "list-uuid-A",
            title: "IELTS Academic Words - Unit 1",
            wordCount: 50,
            dueWordCount: 5,
            tags: ["ielts", "academic"],
            creator: {
                display_name: "Thomas Anderson",
            },
            description:
                "This list contains academic vocabulary frequently used in IELTS writing and speaking tasks. Review it regularly!",
        };
        setListInfo(dummyList);
    }, []);

    const handleReviewTypeChange = (value) => {
        setSelectedMethod(value);
        console.log("Selected review method:", value);
    };

    return (
        <div className="review">
            <Header />
            <h1 className="review__title">Review with Spaced Repetition</h1>
            <SideBar />
            <div className="review__content">
                <div className="review__main">
                    {listInfo ? (
                        <>
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
                                    <div>Created by: {listInfo.creator?.display_name}</div>
                                </div>
                            </div>

                            <div className="review__information">
                                <div className='sub-title'>Description</div> <div className='sub-content'>{listInfo.description}</div>
                                <div className='stats'>
                                    <div className='sub-title'>Total words:</div> <div className='sub-content'>{listInfo.wordCount} words</div>
                                </div>
                                <div className='stats'>
                                    <div className='sub-title'>Reviewed words:</div> <div className='sub-content'>{listInfo.dueWordCount} words</div>
                                </div>
                            </div>

                        </>
                    ) : (
                        <p>Loading list information...</p>
                    )}

                    <div className="review__methods">
                        <div className="review__information">
                            <div className='sub-title'>Method:</div>
                        </div>
                        <div className="review__dropdownWrapper">
                            <select value={selectedMethod} onChange={(e) => handleReviewTypeChange(e.target.value)}>
                                <option value="Flashcards">Flashcards</option>
                                <option value="Word Association">Word Association</option>
                                <option value="Fill in Blank">Fill in Blank</option>
                            </select>
                            <img src={DropdownIcon} alt="DropdownIcon" className="dropdown__icon"/>
                        </div>
                    </div>

                    <div className="review__start">
                        <button className="review__start-button" onClick={() => console.log("Start review session")}>
                            Start Review Session    
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
