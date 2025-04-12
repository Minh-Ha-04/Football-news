import { useState, useEffect } from 'react';
import styles from './Saved.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faShare } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import HotNews from '~/components/HotNews';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';

const cx = classNames.bind(styles);

function Saved() {
    const { user } = useAuth();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                if (user && user.savedPosts && user.savedPosts.length > 0) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:5000/posts/saved', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data.success) {
                        setSavedPosts(response.data.data);
                    }
                } else {
                    setSavedPosts([]);
                }
            } catch (error) {
                console.error('Error fetching saved posts:', error);
                setSavedPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, [user]);

    const handleUnsave = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/posts/${postId}/unsave`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSavedPosts(savedPosts.filter(post => post._id !== postId));
            }
        } catch (error) {
            console.error('Error unsaving post:', error);
        }
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    return (
        <div className='wrapper'>
            <div className={cx('title')}>Tin đã lưu</div>
            <div className={cx('content')}>
                {savedPosts.length > 0 ? (
                    savedPosts.map((post) => (
                        <div key={post._id} className={cx('item')}>
                            <HotNews data={post} />
                            <div className={cx('media')}>
                                <Button 
                                    rounded 
                                    className={cx('media-item')}
                                    onClick={() => handleUnsave(post._id)}
                                >
                                    <FontAwesomeIcon icon={faBookBookmark} />
                                    Bỏ lưu
                                </Button>
                                <Button rounded className={cx('media-item')}>
                                    <FontAwesomeIcon icon={faShare} />
                                    Chia sẻ
                                </Button>
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