import styles from './News.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Ads from '~/components/Ads';
import { useEffect, useState } from 'react';
import HotNews from '~/components/HotNews';
import axios from 'axios';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;

function News() {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${API_URL}/articles?page=${currentPage}&limit=10`);
                const data = response.data;
                // Sắp xếp bài viết theo thời gian đăng mới nhất
                const sortedArticles = data.articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setArticles(sortedArticles);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll lên đầu trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={cx('news')}>
            <Section/>
            <div className={cx('container')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhất</h2>
                    <div className={cx('news-grid')}>
                        {articles.map((article) => (
                            <HotNews key={article._id} article={article} />
                        ))}
                    </div>
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
                <div className={cx('right')}>
                    <Ads />
                </div>
            </div>
        </div>
    );
}

export default News;
