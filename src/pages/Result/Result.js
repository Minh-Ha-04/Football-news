import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Result.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 10;

function Result() {
    const location = useLocation();
    const navigate = useNavigate();

    // Destructure data correctly from location.state
    const { results = {}, searchTerm = '', teamInfo } = location.state || {};
    const { articles = [], currentPage = 1, totalPages = 1 } = results;

    useEffect(() => {
        console.log(location.state); // Kiểm tra location.state để xem có teamInfo không
    }, [location.state]);

    const handleTeamClick = (team) => {
        navigate(`/team/${team._id}`, { state: { team } });
    };

    // Tính toán các bài viết cho trang hiện tại
    const getCurrentPageItems = () => {
        if (!Array.isArray(articles)) return []; // Đảm bảo articles là mảng
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return articles.slice(startIndex, endIndex); // Sử dụng slice để lấy bài viết cho trang hiện tại
    };

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        navigate('/result', { state: { ...location.state, results: { ...results, currentPage: pageNumber } } });
    };

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }
        return pageNumbers;
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Kết quả tìm kiếm cho "{searchTerm}"</h2>

            {/* Hiển thị thông tin đội bóng */}
            {teamInfo && (
                <div className={cx('team-info')} onClick={() => handleTeamClick(teamInfo)}>
                    <img src={`${API_URL}${teamInfo.logo}`} alt={teamInfo.name} className={cx('team-logo')} />
                    <h2 className={cx('team-name')}>{teamInfo.name}</h2>
                </div>
            )}

            <div className={cx('content')}>
                <h3 className={cx('result-title')}>
                    {articles.length > 0
                        ? `Các bài viết liên quan (${articles.length})`
                        : 'Không có bài viết nào liên quan'}
                </h3>
                {getCurrentPageItems().map((article, index) => (
                    <HotNews key={`${article._id}-${index}`} article={article} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className={cx('pagination')}>
                    {getPageNumbers().map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={cx('page-btn', { active: currentPage === pageNumber })}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Result;
