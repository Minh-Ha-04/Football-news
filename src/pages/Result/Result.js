import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Result.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';
import { useState } from 'react';

const cx = classNames.bind(styles);
const API_URL=process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 10;

function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, teamInfo, searchTerm } = location.state || {};
    const [currentPage, setCurrentPage] = useState(1);

    const handleTeamClick = (team) => {
        navigate(`/team/${team._id}`, { state: { team } });
    };

    // Tính toán số trang
    const totalPages = results ? Math.ceil(results.length / ITEMS_PER_PAGE) : 0;
    
    // Lấy các bài viết cho trang hiện tại
    const getCurrentPageItems = () => {
        if (!results) return [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return results.slice(startIndex, endIndex);
    };

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {teamInfo && (
                <div className={cx('team-info')} onClick={() => handleTeamClick(teamInfo)}>
                    <img src={`${API_URL}${teamInfo.logo}`} alt={teamInfo.name} className={cx('team-logo')} />
                    <h2 className={cx('team-name')}>{teamInfo.name}</h2>
                </div>
            )}

            <div className={cx('content')}>
                <h3 className={cx('result-title')}>
                    {results && results.length > 0 
                        ? `Các bài viết liên quan (${results.length})` 
                        : 'Không có bài viết nào liên quan'
                    }
                </h3>
                {getCurrentPageItems().map((article, index) => (
                    <HotNews
                        key={`${article._id}-${index}`}
                        article={article}
                    />
                ))}

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
        </div>
    );
}

export default Result;