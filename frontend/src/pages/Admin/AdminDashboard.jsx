import { useNavigate } from 'react-router-dom';
import { AdminSubMenu, Footer, Header } from '../../components';
import { AnalyticsIcon, ApproveIcon, UsersIcon } from '../../assets/Admin';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Mock data for the dashboard
    const stats = {
        users: 250,
        serverLoad: 32.5,
        teacherRequests: 14,
        moderateContent: 3
    };

    const quickActions = [
        {
            title: 'Ban/Unban Account',
            description: 'Manage users access',
            icon: <img src={UsersIcon} alt="Users Icon" className='icon' />,
            action: () => navigate('/admin-users')
        },
        {
            title: 'Approve Teacher Requests',
            description: 'Review teaching applications',
            icon: <img src={ApproveIcon} alt="Approve Icon" className='icon' />,
            action: () => navigate('/teacher-verification')
        },
        {
            title: 'View system analytics',
            description: 'Review system performance and usage',
            icon: <img src={AnalyticsIcon} alt="Analytics Icon" className='icon' />,
            action: () => navigate('/admin-dashboard')
        }
    ];

    return (
        <div className="dashboard">
            <Header />
            <main className="main-content">
                <AdminSubMenu />

                <section className="dashboard__section">
                    <div className="dashboard__header">
                        <h1>System Overview</h1>
                    </div>

                    <div className="dashboard__stats">
                        <div className="stat-card stat-card--users">
                            <div className="stat-number">{stats.users}</div>
                            <div className="stat-label">Users</div>
                        </div>

                        <div className="stat-card stat-card--server">
                            <div className="stat-number">{stats.serverLoad}%</div>
                            <div className="stat-label">Server load</div>
                        </div>

                        <div className="stat-card stat-card--requests">
                            <div className="stat-number">{stats.teacherRequests}</div>
                            <div className="stat-label">Teacher request</div>
                            <div className="stat-subtitle">{stats.teacherRequests} requests to review</div>
                        </div>

                        <div className="stat-card stat-card--content">
                            <div className="stat-number">{stats.moderateContent}</div>
                            <div className="stat-label">Moderate Content</div>
                            <div className="stat-subtitle">{stats.moderateContent} reports to review</div>
                        </div>
                    </div>

                    <div className="dashboard__actions">
                        <div className="activity-log-card">
                            <h3>Activity log</h3>
                            <div className="activity-chart">
                                <div className="chart-bars">
                                    <div className="bar" style={{height: '60%'}}></div>
                                    <div className="bar" style={{height: '80%'}}></div>
                                    <div className="bar" style={{height: '40%'}}></div>
                                    <div className="bar" style={{height: '90%'}}></div>
                                    <div className="bar" style={{height: '70%'}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            {quickActions.map((action, index) => (
                                <div 
                                    key={index} 
                                    className="action-card"
                                    onClick={action.action}
                                >
                                    <div className="action-icon">{action.icon}</div>
                                    <div className="action-content">
                                        <h4>{action.title}</h4>
                                        <p>{action.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;