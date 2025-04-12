import { useState, useEffect } from 'react';
import styles from './Viewed.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '~/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Viewed() {
    const { user } = useAuth();
    const [viewedPosts, setViewedPosts] = useState([]);

    useEffect(() => {
        if (user && user.viewedPosts) {
            setViewedPosts(user.viewedPosts);
        }
    }, [user]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h2 className={cx('title')}>
                    Bài viết đã xem
                </h2>
                {viewedPosts.length > 0 ? (
                    <div className={cx('post-list')}>
                        {viewedPosts.map((post) => (
                            <div key={post._id} className={cx('post-item')}>
                                <img src={post.thumbnail} alt={post.title} className={cx('thumbnail')} />
                                <div className={cx('content')}>
                                    <h3 className={cx('title')}>{post.title}</h3>
                                    <p className={cx('description')}>{post.description}</p>
                                    <span className={cx('date')}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={cx('empty')}>Bạn chưa xem bài viết nào</div>
                )}
            </div>
        </div>
    );
}

export default Viewed;
