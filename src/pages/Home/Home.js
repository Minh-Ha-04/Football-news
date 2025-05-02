import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import Section from '~/layouts/components/Section';
import Button from '~/components/Button';
import HotNews from '~/components/HotNews';
import Ads from '~/components/Ads';
import axios from 'axios';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;

function Home() {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/articles?page=${currentPage}&limit=10`);
                const data = response.data;
                // Sắp xếp bài viết theo thời gian đăng mới nhất
                const sortedArticles = data.articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setArticles(sortedArticles);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage]);

    // Lấy 5 bài viết mới nhất cho layout 2-1-2
    const latestArticles = articles.slice(0, 5);
    // Các bài viết còn lại cho phần HotNews
    const remainingArticles = articles.slice(5);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll lên đầu trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={cx('home')}>
            <Section /> 
            <div className={cx('content')}>                
                {/* Cột trái - 2 bài viết */}
                <div className={cx('col-left')}>
                    {latestArticles.slice(0, 2).map((article) => (
                        <Link key={article._id} to={routes.detail.replace(':slug', article.slug)} className={cx('news-item')}>
                            <div className={cx('image-container')}>
                                <img src={`${API_URL}${article.image}`} alt={article.title} />
                            </div>
                            <div className={cx('content')}>
                                <h3 className={cx('title')}>{article.title}</h3>
                                <p className={cx('description')}>{article.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Cột giữa - 1 bài viết nổi bật */}
                {latestArticles[2] && (
                    <div className={cx('col-mid')}>
                        <Link to={routes.detail.replace(':slug', latestArticles[2].slug)} className={cx('news-item', 'featured')}>
                            <div className={cx('image-container')}>
                                <img src={`${API_URL}${latestArticles[2].image}`} alt={latestArticles[2].title} />
                            </div>
                            <div className={cx('content')}>
                                <h3 className={cx('title')}>{latestArticles[2].title}</h3>
                                <p className={cx('description')}>{latestArticles[2].description}</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Cột phải - 2 bài viết */}
                <div className={cx('col-right')}>
                    {latestArticles.slice(3, 5).map((article) => (
                        <Link key={article._id} to={routes.detail.replace(':slug', article.slug)} className={cx('news-item')}>
                            <div className={cx('image-container')}>
                                <img src={`${API_URL}${article.image}`} alt={article.title} />
                            </div>
                            <div className={cx('content')}>
                                <h3 className={cx('title')}>{article.title}</h3>
                                <p className={cx('description')}>{article.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className={cx('wrapper')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('section-title')}>Tin tức mới nhất</h2>

                    {remainingArticles.map((article) => (
                        <HotNews key={article._id} article={article} />
                    ))}
                    
                    {/* Thông báo khi hết bài viết */}
                    {currentPage === totalPages && totalPages > 0 && (
                        <div className={cx('no-more-articles')}>
                            Hết bài viết
                        </div>
                    )}

                    {/* Phân trang */}
                    <div className={cx('pagination')}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={cx('page-btn', { active: currentPage === page })}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    
                </div>
                <Ads />
            </div>
        </div>
    );
}

export default Home;
