import { Completion, LowPerformance, Time, TotalLearner } from "../../../assets/Classroom";
import { AssignSubMenu, ClassroomTitle, TeacherClassroomMenuTab } from "../../../components";
import { useState, useEffect } from "react";
import classroomService from "../../../services/Classroom/classroomService";

export default function Statistic() {
    // Truy xuất dữ liệu lớp học được lưu khi users chọn classroom ở trang MyClassroom. 
    const [classroomId, setClassroomId] = useState(() => {
        const selectedClassroom = JSON.parse(localStorage.getItem("selectedClassroom"));
        return selectedClassroom?.id || null;
    });

    // Truy xuất assignment 
    const [assignment, setAssignment] = useState(() => {
        const selectedAssignment = JSON.parse(localStorage.getItem("selectedAssignment"));
        return selectedAssignment;
    })

    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        console.log(classroomId, assignment);
        if (!classroomId || !assignment?.id) {
            console.error("Missing classroom ID or assignment ID");
            return;
        }

        const fetchStatistics = async () => {
            const res = await classroomService.getAssignmentStatistics(classroomId, assignment?.id);
            if(res.success){
                console.log("Fetch statistics thanh cong");
                setStatistics(res.data);
            }
            else{
                console.log(res?.message);
            }
        }
        fetchStatistics();
    }, [classroomId, assignment?.id])
    return (
        <div className="statistics">
            <ClassroomTitle />

            <AssignSubMenu />
            <section className="summary">
                <div className="card pink">
                    <h4>Total Learners</h4>
                    <img src={TotalLearner} alt="total-learner" style={{ width: "50px" }} />
                    <p>{statistics?.summary?.totalLearners}</p>
                </div>
                <div className="card green">
                    <h4>Completion Rate</h4>
                    <img src={Completion} alt="completion-rate" style={{ width: "50px" }} />
                    <p>{statistics?.summary?.completionRate}</p>
                </div>
                <div className="card red">
                    <h4>Low performer</h4>
                    <img src={LowPerformance} alt="low-performance" style={{ width: "50px" }} />
                    <p>{statistics?.summary?.lowPerformers}</p>
                </div>
                <div className="card blue">
                    <h4>Avg. Study Time</h4>
                    <img src={Time} alt="avg-time" style={{ width: "50px" }} />
                    <p>{statistics?.summary?.avgStudyTimeInSeconds}</p>
                </div>
            </section>

            <section className="weekly-progress">
                <h4>Weekly Average Progress</h4>
                <div className="chart-placeholder">[Chart goes here]</div>
            </section>

            <section className="student-list">
                <h4>Learner Performance</h4>
                <table>
                    <thead>
                        <tr className="student-row">
                            <th>Learner</th>
                            <th>Progress</th>
                            <th>Avg. Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statistics?.learners?.map((learner) => (
                            <tr className="student-row" key={learner?.learnerId}>
                                <td>{learner?.displayName}</td>
                                <td>
                                    <div className="progress-bar">
                                        <div
                                            className="fill"
                                            style={{ width: `${learner?.progress}%` }}
                                        ></div>
                                    </div>
                                </td>
                                <td>{learner?.score}</td>
                                <td>{learner?.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}