import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Detail.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Ads from '~/components/Ads';
import HotNews from '~/components/HotNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faShare, faBookmark, faXmark,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Detail() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    
    const [articles, setArticles] = useState([]);
    const [visibleArticles, setVisibleArticles] = useState(5);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:5000/articles');
                const data = await response.json();
                // Sắp xếp bài viết theo thời gian đăng mới nhất
                const sortedArticles = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setArticles(sortedArticles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/articles/${slug}`);
                const data = response.data;
                
                if (isMounted) {
                    setArticle(data);

                    // Kiểm tra xem bài viết đã được lưu chưa
                    if (user) {
                        try {
                            const token = localStorage.getItem('token');
                            // Lưu bài viết đã xem
                            await axios.post(`http://localhost:5000/article/${data._id}/view`, {}, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            // Kiểm tra trạng thái lưu bài
                            const savedResponse = await axios.get(`http://localhost:5000/article/saved`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            // Kiểm tra xem bài viết hiện tại có trong danh sách đã lưu không
                            const isArticleSaved = savedResponse.data.data.some(
                                savedArticle => savedArticle.article._id === data._id
                            );
                            setIsSaved(isArticleSaved);
                        } catch (error) {
                            console.error('Lỗi khi kiểm tra trạng thái bài viết:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy bài viết:', error);
                toast.error('Không thể tải bài viết');
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

    const handleSave = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để lưu bài viết');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (isSaved) {
                // Gửi request DELETE để bỏ lưu bài viết
                await axios.delete(`http://localhost:5000/article/${article._id}/unsave`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Đã bỏ lưu bài viết');
            } else {
                // Gửi request POST để lưu bài viết, không cần gửi dữ liệu
                await axios.post(`http://localhost:5000/article/${article._id}/save`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Đã lưu bài viết');
            }
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Lỗi khi thực hiện thao tác:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
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
            <ToastContainer />
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
                        <button className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </button>
                        <button className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </button>
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
                    <div className={cx('media')}>
                        <button rounded className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </button>
                        <button rounded className={cx('media-item')} onClick={() => setShowFeedback(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Gửi góp ý
                        </button>
                        <button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </button>
                    </div>

                    {/* Feedback Modal */}
                    {showFeedback && (
                        <div className={cx('modal-overlay')}>
                            <div className={cx('modal')}>
                                <div className={cx('modal-header')}>
                                    <h3>Gửi góp ý</h3>
                                    <button className={cx('close-btn')} onClick={() => setShowFeedback(false)}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                                <form onSubmit={handleFeedbackSubmit} className={cx('feedback-form')}>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Nhập góp ý của bạn..."
                                        required
                                    />
                                    <button type="submit" className={cx('submit-btn')}>
                                        Gửi
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                        <div className={cx('hot-news')}>
                        {articles.slice(0, visibleArticles).map((art) => (
                             <HotNews key={art._id} article={art} />
                        ))}                
                        </div>
                        {articles.length > visibleArticles && (
                            <div className={cx('button')}>
                                <Button rounded onClick={() => setVisibleArticles(prev => prev + 5)}>
                                    Xem thêm <FontAwesomeIcon icon={faChevronDown} />
                                </Button>
                            </div>
                        )}
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
