import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AdminSubMenu, Footer, Header } from '../../components';

const AdminUsers = () => {
    const requests = [
        { id: 123, username: 'Mia Nguyen', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Alex Nguyen', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Maria Grande', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Billie Eilish', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Brad Pitt', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Phi Hùng', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Hoàng Phan', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Quang Nghị', email: 'janesmith@gmail.com' },
        { id: 123, username: 'Hiệp Thắng', email: 'johndoe@gmail.com' }
    ];

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter users based on search term
    const filteredRequests = requests.filter(request => {
        if (!searchTerm) return true; // Show all if no search term
        
        const searchLower = searchTerm.toLowerCase();
        const username = request.username || '';
        const email = request.email || '';
        const id = request.id?.toString() || '';
        
        return username.toLowerCase().includes(searchLower) ||
               email.toLowerCase().includes(searchLower) ||
               id.includes(searchLower);
    });

    

    return (
        <div className="teacher-request-page">
            <Header />
            <main className="main-content">
                <AdminSubMenu />

                <section className="requests-section">
                    <div className="requests-header">
                        <h1>Users</h1>
                        <div className="pending-request__filter-dropdown">
                            <span>All lists: {filteredRequests.length}</span>
                            <select
                                value="/admin-users"
                                onChange={(e) => navigate(e.target.value)}
                            >
                                <option value="/teacher-request">Teacher's Request</option>
                                <option value="/admin-users">Users</option>
                            </select>
                        </div>
                    </div>
                    <div className="find-user-bar">
                        <input 
                            type="text" 
                            placeholder="Enter content you want to find"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <table className="requests-table">
                        <thead>
                            <tr className='request-table__tr'>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Verify</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.id}</td>
                                    <td>{request.username}</td>
                                    <td>{request.email}</td>
                                    <td>
                                        <div className="btn">
                                            <button className="btn verify"
                                            // onClick={() => handleApproveJoinRequest(item.learner_id)}
                                            >Verifed</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="review-btn" onClick={() => navigate("/admin-teacher-verification")}>-</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AdminUsers;