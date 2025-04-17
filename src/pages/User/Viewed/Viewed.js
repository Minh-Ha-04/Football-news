import { useState, useEffect } from 'react';
import styles from './Viewed.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';
import Article from '~/components/Article';

const cx = classNames.bind(styles);

function Viewed() {
    const { user } = useAuth();
    const [viewedPosts, setViewedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViewedPosts = async () => {
            if (!user) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/article/viewed', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.data) {
                    // Sắp xếp bài viết theo thời gian xem mới nhất
                    const sortedPosts = response.data.data.sort((a, b) => 
                        new Date(b.viewedAt) - new Date(a.viewedAt)
                    );
                    setViewedPosts(sortedPosts);
                }
            } catch (error) {
                console.error('Error fetching viewed posts:', error);
                setViewedPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchViewedPosts();
    }, [user]);

    if (!user) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('title')}>Tin đã xem</div>
                <div className={cx('content')}>
                    <div className={cx('empty-message')}>
                        Vui lòng đăng nhập để xem lịch sử bài viết đã xem
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('title')}>Tin đã xem</div>
                <div className={cx('loading')}>Đang tải...</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Tin đã xem</div>
            <div className={cx('content')}>
                {viewedPosts.length > 0 ? (
                    viewedPosts.map((post) => (
                        <div key={post.article._id} className={cx('article-item')}>
                            <Article data={post.article}/>
                            <div className={cx('viewed-time')}>
                                Đã xem: {new Date(post.viewedAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={cx('empty-message')}>
                        Bạn chưa xem bài viết nào
                    </div>
                )}
            </div>
        </div>
    );
}

export default Viewed;
