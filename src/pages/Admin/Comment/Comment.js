import { useState, useEffect } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;

function Comment() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchComments();
    }, [currentPage]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/comments`, {
                params: {
                    page: currentPage,
                    limit: limit
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setComments(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách góp ý:', error);
            toast.error('Không thể tải danh sách góp ý');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Quản lý góp ý</h1>
            
            <div className={cx('comments-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Người dùng</th>
                            <th>Bài viết</th>
                            <th>Nội dung</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan="4" className={cx('no-data')}>
                                    Không có góp ý nào
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment._id}>
                                    <td>
                                        <div className={cx('user-info')}>
                                            <img 
                                                src={comment.user?.avatar || '/images/default-avatar.png'} 
                                                alt={comment.user?.name} 
                                                className={cx('avatar')}
                                            />
                                            <div className={cx('user-details')}>
                                                <span className={cx('name')}>{comment.user?.name}</span>
                                                <span className={cx('email')}>{comment.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <a 
                                            href={`/article/${comment.article?.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cx('article-link')}
                                        >
                                            {comment.article?.title}
                                            <FontAwesomeIcon icon={faEye} className={cx('view-icon')} />
                                        </a>
                                    </td>
                                    <td className={cx('content')}>{comment.content}</td>
                                    <td className={cx('date')}>{formatDate(comment.createdAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={cx('pagination')}>
                    <button 
                        className={cx('page-btn', { disabled: currentPage === 1 })}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    <span className={cx('page-info')}>
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button 
                        className={cx('page-btn', { disabled: currentPage === totalPages })}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default Comment;