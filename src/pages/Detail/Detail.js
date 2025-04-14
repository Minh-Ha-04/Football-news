import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Detail.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Button from '~/components/Button';
import Ads from '~/components/Ads';
import HotNews from '~/components/HotNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faShare, faBookmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const cx = classNames.bind(styles);

function Detail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        let isMounted = true;

        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:5000/articles/${slug}`);
                const data = await response.json();
                
                if (isMounted) {
                    setArticle(data);

                    // Lưu bài viết đã xem nếu người dùng đã đăng nhập
                    if (user) {
                        try {
                            const token = localStorage.getItem('token');
                            await axios.post(`http://localhost:5000/article/${data._id}/view`, {}, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            console.log('Đã lưu bài viết đã xem');
                        } catch (error) {
                            console.error('Lỗi khi lưu bài viết đã xem:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy bài viết:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchArticle();

        return () => {
            isMounted = false;
        };
    }, [slug, user]);

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi feedback ở đây
        console.log('Feedback:', feedback);
        setFeedback('');
        setShowFeedback(false);
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    if (!article) {
        return <div className={cx('error')}>Không tìm thấy bài viết</div>;
    }

    return (
        <div className={cx('news')}>
            <Section />
            <div className={cx('container')}>
                <div className={cx('left')}>
                    <div className={cx('article-header')}>
                        <h1 className={cx('title')}>{article.title}</h1>
                        <div className={cx('meta')}>
                            <span className={cx('date')}>
                                {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className={cx('media')}>
                        <Button rounded className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>

                    <strong className={cx('desc')}>
                        {article.description}
                    </strong>
                    <div className={cx('article-image')}>
                        {article.image && (
                            <img src={article.image} alt={article.title} />
                        )}
                    </div>
                    <div className={cx('content')}>
                        {article.content}
                    </div>
                    <p className={cx('author')}>Tác giả :Tiến Long</p>
                    <div className={cx('media')}>
                        <Button rounded className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </Button>
                        <Button rounded className={cx('media-item')} onClick={() => setShowFeedback(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Gửi góp ý
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>

                    {/* Feedback Modal */}
                    {showFeedback && (
                        <div className={cx('modal-overlay')}>
                            <div className={cx('modal')}>
                                <div className={cx('modal-header')}>
                                    <h3>Gửi góp ý</h3>
                                    <Button className={cx('close-btn')} onClick={() => setShowFeedback(false)}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </Button>
                                </div>
                                <form onSubmit={handleFeedbackSubmit} className={cx('feedback-form')}>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Nhập góp ý của bạn..."
                                        required
                                    />
                                    <Button type="submit" className={cx('submit-btn')}>
                                        Gửi
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={cx('hotnews')}>
                        <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                        <HotNews />
                        <div className={cx('button')}>
                            <Button rounded>Xem thêm</Button>
                        </div>
                    </div>
                </div>
                <div className={cx('right')}>
                    <Ads />
                </div>
            </div>
        </div>
    );
}

export default Detail;
