    import { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import styles from './Detail.module.scss';
    import classNames from 'classnames/bind';
    import Section from '~/layouts/components/Section';
    import Ads from '~/components/Ads';
    import HotNews from '~/components/HotNews';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faBookBookmark, faShare, faBookmark, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
    import axios from 'axios';
    import { toast, ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

    const cx = classNames.bind(styles);
    const API_URL=process.env.REACT_APP_API_URL;

    function Detail() {
        const { slug } = useParams();
        const [article, setArticle] = useState(null);
        const [loading, setLoading] = useState(true);
        const [isSaved, setIsSaved] = useState(false);
        const [showFeedback, setShowFeedback] = useState(false);
        const [feedback, setFeedback] = useState('');
        const [user] = useState(JSON.parse(localStorage.getItem('user')));
        const [relatedArticles, setRelatedArticles] = useState([]);

        useEffect(() => {
            let isMounted = true;

            const fetchArticle = async () => {
                try {
                    const response = await axios.get(`${API_URL}/articles/${slug}`);
                    const data = response.data;
                    if (isMounted) {
                        setArticle(data);

                        // Fetch related articles based on tags
                        if (data.tags && data.tags.length > 0) {
                            try {
                                // Lấy bài viết liên quan cho mỗi tag
                                const relatedPromises = data.tags.map(tag => 
                                    axios.get(`${API_URL}/articles/search?tag=${tag}`)
                                );
                                const relatedResponses = await Promise.all(relatedPromises);
                                // Gộp tất cả bài viết liên quan và loại bỏ trùng lặp
                                const allRelatedArticles = relatedResponses
                                    .flatMap(response => response.data ||[])
                                    .filter(relatedArticle => relatedArticle && relatedArticle._id && relatedArticle._id !== data._id)
                                    .reduce((unique, article) => {
                                        if (!unique.some(item => item._id === article._id)) {
                                            unique.push(article);
                                        }
                                        return unique;
                                    }, [])
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 6);
                                setRelatedArticles(allRelatedArticles);
                            } catch (error) {
                                console.error('Lỗi khi lấy bài viết liên quan:', error);
                                setRelatedArticles([]); // Set empty array if there's an error
                            }
                        } else {
                            setRelatedArticles([]); // Set empty array if no tags
                        }

                        // Kiểm tra xem bài viết đã được lưu chưa
                        if (user) {
                            try {
                                const token = localStorage.getItem('token');
                                // Lưu bài viết đã xem
                                await axios.post(`${API_URL}/article/${data._id}/view`, {}, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                });

                                // Kiểm tra trạng thái lưu bài
                                const savedResponse = await axios.get(`${API_URL}/article/saved`, {
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
                    await axios.delete(`${API_URL}/article/${article._id}/unsave`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    toast.success('Đã bỏ lưu bài viết');
                } else {
                    // Gửi request POST để lưu bài viết, không cần gửi dữ liệu
                    await axios.post(`${API_URL}/article/${article._id}/save`, {}, {
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

        const handleFeedbackSubmit = async (e) => {
            e.preventDefault();
            if (!user) {
                toast.error('Vui lòng đăng nhập để gửi góp ý');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${API_URL}/comments`,
                    {
                        content: feedback,
                        articleId: article._id
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    toast.success('Gửi góp ý thành công');
                    setFeedback('');
                    setShowFeedback(false);
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
                }
            } catch (error) {
                console.error('Lỗi khi gửi góp ý:', error);
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
            }
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
                                <FontAwesomeIcon icon={faBookmark } />
                                {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                            </button>
                        </div>

                        <strong className={cx('desc')}>
                            {article.description}
                        </strong>
                        <div className={cx('article-image')}>
                            {article.image && (
                                <img src={`${API_URL}${article.image}`} alt={article.title} />
                            )}
                        </div>
                        <div className={cx('content')}>
                            {article.content}
                        </div>
                        <div className={cx('media')}>
                            <button  className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                                <FontAwesomeIcon icon={ faBookmark} />
                                {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                            </button>
                            <button  className={cx('media-item')} onClick={() => setShowFeedback(true)}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Gửi góp ý
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
                            <h2 className={cx('header')}>Tin bóng đá liên quan</h2>
                            <div className={cx('related-articles')}>
                                {relatedArticles.map((relatedArticle) => (
                                    <HotNews key={relatedArticle._id} article={relatedArticle} />
                                ))}
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
