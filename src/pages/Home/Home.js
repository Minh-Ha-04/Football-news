import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import Section from '~/layouts/components/Section';
import Button from '~/components/Button';
import Article from '~/components/Article';
import HotNews from '~/components/HotNews';
import Ads from '~/components/Ads';

const cx = classNames.bind(styles);

function Home() {
    const [articles, setArticles] = useState([]);

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

    // Lấy 5 bài viết mới nhất cho layout 2-1-2
    const latestArticles = articles.slice(0, 5);
    // Các bài viết còn lại cho phần HotNews
    const remainingArticles = articles.slice(5);

    return (
        <div className={cx('home')}>
            <div className={cx('content')}>                
                        {/* Cột trái - 2 bài viết */}
                        <div className={cx('col-left')}>
                            {latestArticles.slice(0, 2).map((article) => (
                                <Link key={article._id} to={routes.detail.replace(':slug', article.slug)} className={cx('news-item')}>
                                    <div className={cx('image-container')}>
                                        <img src={article.image || 'https://via.placeholder.com/300x200'} alt={article.title} />
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
                                        <img src={latestArticles[2].image || 'https://via.placeholder.com/400x300'} alt={latestArticles[2].title} />
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
                                        <img src={article.image || 'https://via.placeholder.com/300x200'} alt={article.title} />
                                    </div>
                                    <div className={cx('content')}>
                                        <h3 className={cx('title')}>{article.title}</h3>
                                        <p className={cx('description')}>{article.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
            </div>
            <Section /> 
            <div className={cx('wrapper')}>
                <div className={cx('hotnews')}>
                <h2 className={cx('section-title')}>Tin tức mới nhất</h2>
                        <div className={cx('news-grid')}>
                            {remainingArticles.map((article) => (
                                <Link key={article._id} to={routes.detail.replace(':slug', article.slug)} className={cx('news-item')}>
                                    <div className={cx('image-container')}>
                                        <img src={article.image || 'https://via.placeholder.com/200x150'} alt={article.title} />
                                    </div>
                                    <div className={cx('content')}>
                                        <h3 className={cx('title')}>{article.title}</h3>
                                        <p className={cx('description')}>{article.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    <Button rounded>Xem thêm</Button>
                </div>
                <Ads />
            </div>
        </div>
    );
}

export default Home;
