import { useState, useEffect } from 'react';
import styles from './Viewed.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';

const cx = classNames.bind(styles);

function Viewed() {
    const { user } = useAuth();
    const [viewedPosts, setViewedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViewedPosts = async () => {
            try {
                if (user && user.viewedPosts && user.viewedPosts.length > 0) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:5000/posts/viewed', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data.success) {
                        // Nhóm bài viết theo ngày
                        const posts = response.data.data;
                        const grouped = groupPostsByDate(posts);
                        setViewedPosts(grouped);
                    }
                } else {
                    setViewedPosts({});
                }
            } catch (error) {
                console.error('Error fetching viewed posts:', error);
                setViewedPosts({});
            } finally {
                setLoading(false);
            }
        };

        fetchViewedPosts();
    }, [user]);

    // Hàm nhóm bài viết theo ngày
    const groupPostsByDate = (posts) => {
        const grouped = {};
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        posts.forEach(post => {
            const viewedDate = new Date(post.viewedAt || post.createdAt);
            let dateGroup;

            if (isSameDay(viewedDate, today)) {
                dateGroup = 'Hôm nay';
            } else if (isSameDay(viewedDate, yesterday)) {
                dateGroup = 'Hôm qua';
            } else if (isThisWeek(viewedDate, today)) {
                dateGroup = 'Tuần này';
            } else {
                dateGroup = 'Cũ hơn';
            }

            if (!grouped[dateGroup]) {
                grouped[dateGroup] = [];
            }
            grouped[dateGroup].push(post);
        });

        return grouped;
    };

    // Hàm kiểm tra cùng ngày
    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    // Hàm kiểm tra cùng tuần
    const isThisWeek = (date, today) => {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return date >= weekStart && date <= weekEnd;
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Tin đã xem</div>
            <div className={cx('content')}>
                {Object.keys(viewedPosts).length > 0 ? (
                    Object.entries(viewedPosts).map(([date, posts]) => (
                        <div key={date} className={cx('date-section')}>
                            <div className={cx('date-header')}>{date}</div>
                            <div className={cx('articles')}>
                                {posts.map((post) => (
                                    <div key={post._id} className={cx('article-item')}>
                                        <HotNews data={post} />
                                    </div>
                                ))}
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
