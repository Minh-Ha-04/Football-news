import { useState, useEffect } from 'react';
import styles from './HotNews.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function HotNews() {
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

    return (
        <div className={cx('hot-news-container')}>
            {articles.map((article) => (
                <Link key={article._id} to={routes.detail.replace(':slug', article.slug)}>
                    <div className={cx('hot-news-item')}>
                        <div className={cx('image-container')}>
                            <img 
                                src={article.image || 'https://via.placeholder.com/255x170'} 
                                alt={article.title} 
                                className={cx('image')} 
                            />
                        </div>
                        <div className={cx('content')}>
                            <h3 className={cx('title')}>{article.title}</h3>
                            <p className={cx('description')}>{article.description}</p>
                            <div className={cx('time')}>
                                {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default HotNews;
