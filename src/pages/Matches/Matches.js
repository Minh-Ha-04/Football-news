import styles from './Matches.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Ads from '~/components/Ads';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import HotNews from '~/components/HotNews';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL 
function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [articles, setArticles] = useState([]);
    const [visibleArticles, setVisibleArticles] = useState(5);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${API_URL}/articles`);
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
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`${API_URL}/match`);
                if (response.data.success) {
                    setMatches(response.data.data);
                }
            } catch (err) {
                setError('Failed to fetch matches');
                console.error('Error fetching matches:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
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
                                        <FontAwesomeIcon icon={faCalendar} /> Lịch thi đấu
                                    </li>
                                    <li className={cx('header-item')}>
                                        <Link to={routes.tables}><FontAwesomeIcon icon={faTrophy} /> Bảng xếp hạng</Link>
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
                                Object.entries(matchesByRound).map(([round, roundMatches]) => (
                                    <div key={round} className={cx('round-section')}>
                                        <h3 className={cx('round-title')}>Vòng {round}</h3>
                                        <div className={cx('matches-container')}>
                                            {roundMatches.map((match) => (
                                                <div key={match._id} className={cx('match-item')}>
                                                    <div className={cx('match-time')}>
                                                        {new Date(match.matchDate).toLocaleString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                    <div className={cx('match-teams')}>
                                                        <div className={cx('teamhome')}>
                                                            <span className={cx('team-name')}>
                                                                
                                                                {typeof match.homeTeam === 'object' ? match.homeTeam.name : match.homeTeam}
                                                                <img src={`${API_URL}${match.logoHomeTeam}`} alt={match.homeTeam.name} className={cx('team-logo')} />
                                                            </span>
                                                        </div>
                                                        <div className={cx('match-score')}>
                                                        
                                                        {match.status === 'completed'
                                                            ? `${match.score?.home} - ${match.score?.away}`
                                                            : '-'}
                                                        <div className={cx('match-stadium')}>
                                                            {match.stadium}
                                                        </div>
                                                        </div>
                                                        <div className={cx('teamaway')}>
                                                            <span className={cx('team-name')}>
                                                                <img src={`${API_URL}${match.logoAwayTeam}`} alt={match.awayTeam.name} className={cx('team-logo')} />
                                                                {typeof match.awayTeam === 'object' ? match.awayTeam.name : match.awayTeam}
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
                </div>
                <div className={cx('right')}>
                    <Ads />
                </div>
            </div>
        </div>
    );
}

export default Matches;
