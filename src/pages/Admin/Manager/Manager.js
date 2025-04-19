import { useState, useEffect } from 'react';
import styles from './Manager.module.scss'
import classNames from 'classnames/bind';
import axios from 'axios';
import { toast } from 'react-toastify';

const cx= classNames.bind(styles)

function Manager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/auth', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Không thể tải danh sách người dùng');
                toast.error('Không thể tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/auth/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUsers(users.filter(user => user._id !== userId));
                toast.success('Đã xóa người dùng thành công');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.error('Không thể xóa người dùng');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/auth/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setUsers(users.map(user => 
                    user._id === userId ? { ...user, role: newRole } : user
                ));
                toast.success('Đã cập nhật vai trò thành công');
            }
        } catch (err) {
            console.error('Error updating user role:', err);
            toast.error('Không thể cập nhật vai trò');
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Quản lý người dùng</h1>
            
            <div className={cx('search')}>
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cx('search-input')}
                />
            </div>

            <div className={cx('table-container')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đăng nhập</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className={cx('role-select')}
                                    >
                                        <option value="user">Người dùng</option>
                                        <option value="admin">Quản trị viên</option>
                                    </select>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className={cx('delete-btn')}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Manager;