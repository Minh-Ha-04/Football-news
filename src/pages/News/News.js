import styles from './News.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import Article from '~/components/Article';
import Ads from '~/components/Ads';
import { useEffect,useState } from 'react';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function News() {
    const [articles, setArticles] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
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
    // Các bài viết còn lại cho phần HotNews
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5); // mỗi lần click hiện thêm 5 bài
      };
    const remainingArticles = articles.slice(0,visibleCount);
    return (
        <div className={cx('news')}>
            <Section />
            <div className={cx('container')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                    <HotNews />
                    <div className={cx('button')}>
                        <Button rounded onClick={handleLoadMore}>Xem thêm</Button>
                    </div>
                </div>
                <div className={cx('right')}>
                    <Ads />
                </div>
            </div>
        </div>
    );
}

export default News;
