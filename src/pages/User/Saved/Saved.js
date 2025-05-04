import { useState, useEffect } from 'react';
import styles from './Saved.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faShare } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Article from '~/components/Article';

const cx = classNames.bind(styles);
const API_URL=process.env.REACT_APP_API_URL;
function Saved() {
    const { user } = useAuth();
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedArticles = async () => {
            if (!user) {
                setSavedArticles([]);
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/article/saved`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.data) {
                    // Sắp xếp bài viết theo thời gian lưu mới nhất
                    const sortedArticles = response.data.data.sort((a, b) => 
                        new Date(b.savedAt) - new Date(a.savedAt)
                    );
                    setSavedArticles(sortedArticles);
                }
            } catch (error) {
                console.error('Lỗi khi lấy bài viết đã lưu:', error);
                if (error.response?.status === 401) {
                    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
                } else {
                    toast.error('Không thể tải danh sách bài viết đã lưu');
                }
                setSavedArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedArticles();
    }, [user]);

    const handleUnsave = async (articleId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/article/${articleId}/unsave`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSavedArticles(savedArticles.filter(article => article.article._id !== articleId));
                toast.success('Đã bỏ lưu bài viết');
            }
        } catch (error) {
            console.error('Lỗi khi bỏ lưu bài viết:', error);
            toast.error('Có lỗi xảy ra khi bỏ lưu bài viết');
        }
    };

    if (!user) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('title')}>Tin đã lưu</div>
                <div className={cx('content')}>
                    <div className={cx('empty-message')}>
                        Vui lòng đăng nhập để xem bài viết đã lưu
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('title')}>Tin đã lưu</div>
                <div className={cx('loading')}>Đang tải...</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Tin đã lưu</div>
            <div className={cx('content')}>
                {savedArticles.length > 0 ? (
                    savedArticles.map((article) => (
                        <div key={article.article._id} className={cx('item')}>
                            <Article data={article.article} />
                            <div className={cx('media')}>
                                <button 
                                    className={cx('media-item')}
                                    onClick={() => handleUnsave(article.article._id)}
                                >
                                    <FontAwesomeIcon icon={faBookmark} />
                                    Bỏ lưu
                                </button>
                            </div>
                            <div className={cx('saved-time')}>
                                Đã lưu: {new Date(article.savedAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={cx('empty-message')}>
                        Bạn chưa lưu bài viết nào
                    </div>
                )}
            </div>
        </div>
    );
}

export default Saved;