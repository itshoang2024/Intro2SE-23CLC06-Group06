import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import Skeleton from "react-loading-skeleton";
import userService from "../../services/User/userService";
import { toast } from "react-toastify";
import {
  Header,
  Footer,
  SideBar,
  LearnerSubMenu,
} from "../../components/index.jsx";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Generate calendar heatmap data for the last 90 days with intensity levels
const generateCalendarData = (studyData = []) => {
  const today = new Date();
  const calendar = [];
  
  // Create a map of dates to study intensity (number of words learned)
  const studyMap = new Map();
  studyData.forEach(entry => {
    if (typeof entry === 'string') {
      // Simple date string - treat as low intensity
      studyMap.set(entry, 5);
    } else if (entry.date && entry.wordsLearned !== undefined) {
      // Object with date and words learned
      studyMap.set(entry.date, entry.wordsLearned || 0);
    }
  });

  // Get the last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const wordsLearned = studyMap.get(dateStr) || 0;
    let intensityLevel = 'no-study';
    
    if (wordsLearned > 0) {
      if (wordsLearned <= 3) {
        intensityLevel = 'intensity-low';
      } else if (wordsLearned <= 8) {
        intensityLevel = 'intensity-medium';
      } else if (wordsLearned <= 15) {
        intensityLevel = 'intensity-high';
      } else {
        intensityLevel = 'intensity-very-high';
      }
    }

    calendar.push({
      date: dateStr,
      day: date.getDate(),
      month: date.getMonth(),
      hasStudy: wordsLearned > 0,
      wordsLearned: wordsLearned,
      intensityLevel: intensityLevel,
      weekDay: date.getDay(),
    });
  }

  return calendar;
};

export default function LearningStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getStatistics();
      setStatistics(data.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load statistics. Please try again.");
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="statistics-page">
        <Header />
        <LearnerSubMenu />
        <div className="statistics__content">
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

          <div className="statistics__main">
            <div className="learning-statistics">
              <div className="summary">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card">
                    <Skeleton height={120} />
                  </div>
                ))}
              </div>

              <div className="progress-section">
                <h4><Skeleton width={200} height={20} /></h4>
                <div className="chart-wrapper">
                  <Skeleton height={300} />
                </div>
              </div>

              <div className="bottom-section">
                <div className="completion-section">
                  <h4><Skeleton width={250} height={20} /></h4>
                  <div className="chart-wrapper">
                    <Skeleton height={300} />
                  </div>
                </div>

                <div className="consistency-section">
                  <h4><Skeleton width={150} height={20} /></h4>
                  <div className="calendar-heatmap">
                    <Skeleton height={200} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <Header />
        <LearnerSubMenu />
        <div className="statistics__content">
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

          <div className="statistics__main">
            <div className="learning-statistics">
              <div className="error-state">
                <h3>Unable to Load Statistics</h3>
                <p>{error}</p>
                <button onClick={fetchStatistics} className="retry-btn">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="statistics-page">
        <Header />
        <LearnerSubMenu />
        <div className="statistics__content">
          <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

          <div className="statistics__main">
            <div className="learning-statistics">
              <div className="empty-state">
                <h3>No Statistics Available</h3>
                <p>Start learning vocabulary to see your progress!</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const { summaryStats, progressOverTime, completionRates, studyConsistency } =
    statistics;

  // Progress over time chart configuration
  const progressChartData = {
    labels:
      progressOverTime?.data?.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }) || [],
    datasets: [
      {
        label: "Words Learned",
        data: progressOverTime?.data?.map((item) => item.wordsMastered) || [],
        borderColor: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ff6b6b",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const progressChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };

  // Completion rate horizontal bar chart
  const completionChartData = {
    labels:
      completionRates?.data?.map((item) => {
        const name = item.list_name || "Unnamed List";
        return name.length > 15 ? name.substring(0, 15) + "..." : name;
      }) || [],
    datasets: [
      {
        label: "Completion Rate",
        data:
          completionRates?.data?.map((item) =>
            Math.round((item.completion_rate || 0) * 100)
          ) || [],
        backgroundColor: [
          "#fed1e0",
          "#c4e4a4",
          "#a8d8ff",
          "#ffccb3",
          "#e0b3ff",
        ],
        borderColor: ["#cc6386", "#147919", "#2c6fdf", "#d67700", "#8f3fa3"],
        borderWidth: 2,
      },
    ],
  };

  const completionChartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.parsed.x}% completed`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback(value) {
            return value + "%";
          },
          color: "#666",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };

  // Generate calendar heatmap data with mock intensity data for testing
  const mockStudyData = studyConsistency?.data?.map((date, index) => ({
    date: date,
    wordsLearned: Math.floor(Math.random() * 20) + 1 // Random 1-20 words per day
  })) || [];
  
  // Add some additional mock data for recent days if no real data
  if (mockStudyData.length === 0) {
    const mockDates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (Math.random() > 0.3) { // 70% chance of study
        mockDates.push({
          date: date.toISOString().split('T')[0],
          wordsLearned: Math.floor(Math.random() * 18) + 1
        });
      }
    }
    mockStudyData.push(...mockDates);
  }
  
  const calendarData = generateCalendarData(mockStudyData);

  // Group calendar data by weeks
  const weeks = [];
  let currentWeek = [];

  calendarData.forEach((day, index) => {
    if (index === 0) {
      // Fill in empty days at the beginning of the first week
      for (let i = 0; i < day.weekDay; i++) {
        currentWeek.push(null);
      }
    }

    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add the last partial week if it exists
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="statistics-page">
      <Header />
      <LearnerSubMenu />
      <div className="statistics__content">
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="statistics__main">
          <div className="learning-statistics">
            <div className="summary">
              <div className="card pink">
                <h4>{summaryStats?.data?.total_words_learned || 0}</h4>
                <p>words learned</p>
              </div>

              <div className="card green">
                <h4>{studyConsistency?.data?.length || 0} days</h4>
                <p>learning streaks</p>
              </div>

              <div className="card purple">
                <h4>
                  {summaryStats?.data?.total_study_time_minutes
                    ? `${Math.round(summaryStats.data.total_study_time_minutes)}m`
                    : "25m"}
                </h4>
                <p>daily study time</p>
              </div>

              <div className="card blue">
                <h4>
                  {summaryStats?.data?.average_accuracy
                    ? `${Math.round(summaryStats.data.average_accuracy * 100)}%`
                    : "88%"}
                </h4>
                <p>retention rate</p>
              </div>
            </div>

            <div className="progress-section">
              <h4>Progress Over Time</h4>
              <div className="chart-wrapper">
                {progressOverTime?.data?.length > 0 ? (
                  <Line
                    data={progressChartData}
                    options={progressChartOptions}
                  />
                ) : (
                  <div className="empty-chart">
                    <p>Start learning to see your progress over time!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bottom-section">
              <div className="completion-section">
                <h4>Completion rate by recently list</h4>
                <div className="chart-wrapper">
                  {completionRates?.data?.length > 0 ? (
                    <Bar
                      data={completionChartData}
                      options={completionChartOptions}
                    />
                  ) : (
                    <div className="empty-chart">
                      <p>No vocabulary lists completed yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="consistency-section">
                <h4>Study Consistency</h4>
                <div className="calendar-heatmap">
                  <div className="calendar-header">
                    <div className="days-header">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                        <div key={index} className="day-label">
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="calendar-grid">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="calendar-week">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`calendar-day ${day ? (day.hasStudy ? `has-study ${day.intensityLevel}` : "no-study") : "empty"}`}
                            title={
                              day
                                ? `${day.date} - ${day.wordsLearned > 0 ? `${day.wordsLearned} words learned` : "No study"}`
                                : ""
                            }
                          >
                            {day && day.hasStudy && (
                              <div className="day-indicator">
                                <div className="study-dot"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="calendar-legend">
                    <span>Less</span>
                    <div className="legend-colors">
                      <div className="legend-item no-study" title="No study"></div>
                      <div className="legend-item intensity-low" title="1-3 words"></div>
                      <div className="legend-item intensity-medium" title="4-8 words"></div>
                      <div className="legend-item intensity-high" title="9-15 words"></div>
                      <div className="legend-item intensity-very-high" title="16+ words"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
