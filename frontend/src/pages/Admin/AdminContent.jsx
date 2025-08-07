import { useState } from 'react';
import { DropdownIcon } from '../../assets/Vocabulary';
import { AdminSubMenu, Footer, Header } from '../../components';
import { toast } from 'react-toastify';

const AdminContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleReports, setVisibleReports] = useState(4);
    const [reports, setReports] = useState([
        {
            id: 1,
            type: 'WORDS',
            reportContent: 'spam, don\'t like it',
            date: 'Aug, 14, 2025',
            reportedBy: 'user@example.com',
            contentId: 'vocab_123'
        },
        {
            id: 2,
            type: 'WORDS',
            reportContent: 'spam, don\'t like it',
            date: 'Aug, 14, 2025',
            reportedBy: 'user2@example.com',
            contentId: 'vocab_124'
        },
        {
            id: 3,
            type: 'WORDS',
            reportContent: 'spam, don\'t like it',
            date: 'Aug, 14, 2025',
            reportedBy: 'user3@example.com',
            contentId: 'vocab_125'
        },
        {
            id: 4,
            type: 'WORDS',
            reportContent: 'spam, don\'t like it',
            date: 'Aug, 14, 2025',
            reportedBy: 'user4@example.com',
            contentId: 'vocab_126'
        },
        {
            id: 5,
            type: 'WORDS',
            reportContent: 'inappropriate content',
            date: 'Aug, 13, 2025',
            reportedBy: 'user5@example.com',
            contentId: 'vocab_127'
        },
        {
            id: 6,
            type: 'WORDS',
            reportContent: 'offensive language',
            date: 'Aug, 13, 2025',
            reportedBy: 'user6@example.com',
            contentId: 'vocab_128'
        }
    ]);

    // Lọc báo cáo theo từ khóa tìm kiếm
    const filteredReports = reports.filter(report =>
        report.reportContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hiển thị số lượng báo cáo giới hạn
    const displayedReports = filteredReports.slice(0, visibleReports);

    const handleDelete = (reportId) => {
        setReports(prevReports => prevReports.filter(report => report.id !== reportId));
        toast.success('Report deleted successfully');
    };

    const handleKeep = (reportId) => {
        setReports(prevReports => prevReports.filter(report => report.id !== reportId));
        toast.success('Report kept successfully');
    };

    const handleSeeMore = () => {
        setVisibleReports(prev => prev + 4);
    };

    return (
        <div className="admin-report">
            <Header />
            <main className="main-content">
                <AdminSubMenu />

                <section className="admin-report__section">
                    <div className="admin-report__header">
                        <h1>Reported content</h1>
                    </div>
                    
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Enter content you want to find"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="admin-report__list">
                        {displayedReports.map(report => (
                            <div key={report.id} className="admin-report__item">
                                <div className="admin-report__content">
                                    <h3 className="admin-report__type">{report.type}</h3>
                                    <p className="admin-report__text">
                                        <span className="admin-report__label">Report Content:</span> {report.reportContent}
                                    </p>
                                    <p className="admin-report__date">Date: {report.date}</p>
                                </div>
                                <div className="admin-report__actions">
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(report.id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="btn-keep"
                                        onClick={() => handleKeep(report.id)}
                                    >
                                        Keep
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredReports.length > visibleReports && (
                        <div className="see-more-container">
                            <button className="btn-see-more" onClick={handleSeeMore}>
                                See more <img src={DropdownIcon} alt="more" />
                            </button>
                        </div>
                    )}

                    {filteredReports.length === 0 && (
                        <div className="no-reports">
                            <p>No reports found.</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AdminContent;