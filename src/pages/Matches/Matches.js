import styles from './Matches.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Ads from '~/components/Ads';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;
function Matches() {
    const [matches, setMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Đặt fetchMatches bên ngoài useEffect
    const fetchMatches = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/match?page=${page}&limit=10`);
            if (response.data.success) {
                const newMatches = response.data.data;
                setMatches((prevMatches) => {
                    // Loại bỏ các trận đấu trùng lặp
                    const updatedMatches = [
                        ...prevMatches,
                        ...newMatches.filter((newMatch) =>
                            !prevMatches.some((existingMatch) => existingMatch._id === newMatch._id)
                        ),
                    ];
                    return updatedMatches;
                });
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            }
        } catch (err) {
            setError('Lỗi khi tải trận đấu');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };
    

// Gọi fetchMatches lần đầu trong useEffect
useEffect(() => {
    fetchMatches(1);
}, []);


    // Group matches by round
    const matchesByRound = matches.reduce((acc, match) => {
        const round = match.round;
        if (!acc[round]) {
            acc[round] = [];
        }
        acc[round].push(match);
        return acc;
    }, {});

    // Sort rounds in descending order
    const sortedRounds = Object.keys(matchesByRound).sort((a, b) => b - a);

    // Sort matches within each round by matchDate in descending order
    sortedRounds.forEach((round) => {
        matchesByRound[round].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
    });

    return (
        <div className={cx('matches')}>
            <Section />

            <div className={cx('container')}>
                <div className={cx('content')}>
                    <h1 className={cx('title')}>Kết quả BÓNG ĐÁ giải Ngoại Hạng Anh 2024/2025 mới nhất</h1>
                    <p className={cx('desc')}>
                        Trân trọng giới thiệu tới độc giả kết quả thi đấu bóng đá Anh giải Ngoại Hạng Anh - Premier
                        League 2024/2025 nhanh chính xác nhất.
                    </p>
                    <div className={cx('result-list')}>
                        <header className={cx('header-result')}>
                            <div className={cx('left-header')}>
                                <ul className={cx('header-nav')}>
                                    <li className={cx('header-item')}>
                                        <Link to={routes.tables}>
                                            <FontAwesomeIcon icon={faTrophy} /> Bảng xếp hạng
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={cx('right-header')}>Mùa giải 2024/2025</div>
                        </header>
                        <div className={cx('list-match')}>
                            {loading ? (
                                <div className={cx('loading')}>Đang tải dữ liệu...</div>
                            ) : error ? (
                                <div className={cx('error')}>{error}</div>
                            ) : (
                                sortedRounds.map((round) => (
                                    <div key={round} className={cx('round-section')}>
                                        <h3 className={cx('round-title')}>Vòng {round}</h3>
                                        <div className={cx('matches-container')}>
                                            {matchesByRound[round].map((match) => (
                                                <div key={match._id} className={cx('match-item')}>
                                                    <div className={cx('match-time')}>
                                                        {new Date(match.matchDate).toLocaleString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                    <div className={cx('match-teams')}>
                                                        <div className={cx('teamhome')}>
                                                            <span className={cx('team-name')}>
                                                                {typeof match.homeTeam === 'object'
                                                                    ? match.homeTeam.name
                                                                    : match.homeTeam}
                                                                <img
                                                                    src={`${API_URL}${match.logoHomeTeam}`}
                                                                    alt={match.homeTeam.name}
                                                                    className={cx('team-logo')}
                                                                />
                                                            </span>
                                                        </div>
                                                        <div className={cx('match-score')}>
                                                            {match.status === 'completed'
                                                                ? `${match.score?.home} - ${match.score?.away}`
                                                                : '-'}
                                                            <div className={cx('match-stadium')}>{match.stadium}</div>
                                                        </div>
                                                        <div className={cx('teamaway')}>
                                                            <span className={cx('team-name')}>
                                                                <img
                                                                    src={`${API_URL}${match.logoAwayTeam}`}
                                                                    alt={match.awayTeam.name}
                                                                    className={cx('team-logo')}
                                                                />
                                                                {typeof match.awayTeam === 'object'
                                                                    ? match.awayTeam.name
                                                                    : match.awayTeam}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {currentPage < totalPages && (
                    <div className={cx('load-more')}>
                        <button className={cx('button')} onClick={() => fetchMatches(currentPage + 1)} disabled={loading}>
                            {loading ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    </div>
                )}
                </div>
                

                <div className={cx('right')}>
                    <Ads />
                </div>
            </div>
        </div>
    );
}

export default Matches;
