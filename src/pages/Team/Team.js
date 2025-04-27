import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Team.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShirt, 
    faRulerVertical, 
    faWeightScale,
    faTrophy,
    faFutbol,
    faUsers,
    faStadium,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Team() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Lấy thông tin đội bóng
                const teamResponse = await axios.get(`http://localhost:5000/team/${id}`);
                if (teamResponse.data.success) {
                    setTeam(teamResponse.data.data);
                }

                // Lấy danh sách cầu thủ của đội
                const playersResponse = await axios.get(`http://localhost:5000/player/team/${id}`);
                setPlayers(playersResponse.data || []);

            } catch (err) {
                console.error('Error fetching team data:', err);
                setError('Không thể tải thông tin đội bóng');
                toast.error('Không thể tải thông tin đội bóng');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [id]);

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('loading')}>Đang tải...</div>
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('error')}>{error || 'Không tìm thấy thông tin đội bóng'}</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {/* Header Section */}
            <div className={cx('header')}>
                <div className={cx('team-info')}>
                    <div className={cx('logo-container')}>
                        <img 
                            src={team.logo ? `http://localhost:5000${team.logo}` : '/default-team-logo.png'} 
                            alt={team.name} 
                            className={cx('logo')}
                        />
                    </div>
                    <div className={cx('details')}>
                        <h1 className={cx('name')}>{team.name}</h1>
                        <div className={cx('stadium')}>
                            <FontAwesomeIcon icon={faFutbol} />
                            <span>{team.stadium}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className={cx('stats-section')}>
                <h2 className={cx('section-title')}>
                    <FontAwesomeIcon icon={faChartLine} />
                    Thống kê mùa giải
                </h2>
                <div className={cx('stats-grid')}>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faFutbol} />
                        <span className={cx('stat-value')}>{team.seasonStats.matchesPlayed}</span>
                        <span className={cx('stat-label')}>Số trận</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faTrophy} />
                        <span className={cx('stat-value')}>{team.seasonStats.wins}</span>
                        <span className={cx('stat-label')}>Thắng</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faFutbol} />
                        <span className={cx('stat-value')}>{team.seasonStats.draws}</span>
                        <span className={cx('stat-label')}>Hòa</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faFutbol} />
                        <span className={cx('stat-value')}>{team.seasonStats.losses}</span>
                        <span className={cx('stat-label')}>Thua</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faTrophy} />
                        <span className={cx('stat-value')}>{team.seasonStats.points}</span>
                        <span className={cx('stat-label')}>Điểm</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faFutbol} />
                        <span className={cx('stat-value')}>{team.seasonStats.goalsScored}</span>
                        <span className={cx('stat-label')}>Bàn thắng</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faFutbol} />
                        <span className={cx('stat-value')}>{team.seasonStats.goalsConceded}</span>
                        <span className={cx('stat-label')}>Bàn thua</span>
                    </div>
                    <div className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faChartLine} />
                        <span className={cx('stat-value')}>{team.seasonStats.goalDifference}</span>
                        <span className={cx('stat-label')}>Hiệu số</span>
                    </div>
                </div>
            </div>

            {/* Players Section */}
            <div className={cx('players-section')}>
                <h2 className={cx('section-title')}>
                    <FontAwesomeIcon icon={faUsers} />
                    Danh sách cầu thủ
                </h2>
                <div className={cx('players-grid')}>
                    {players.map(player => (
                        <div key={player._id} className={cx('player-card')}>
                            <div className={cx('player-image')}>
                                <img 
                                    src={player.image ? `http://localhost:5000${player.image}` : '/default-player.png'} 
                                    alt={player.name} 
                                />
                            </div>
                            <div className={cx('player-info')}>
                                <h3 className={cx('player-name')}>{player.name}</h3>
                                <div className={cx('player-details')}>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faShirt} />
                                        <span>Số áo: {player.number}</span>
                                    </div>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faFutbol} />
                                        <span>Vị trí: {player.position}</span>
                                    </div>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faRulerVertical} />
                                        <span>Chiều cao: {player.height} cm</span>
                                    </div>
                                    <div className={cx('detail-item')}>
                                        <FontAwesomeIcon icon={faWeightScale} />
                                        <span>Cân nặng: {player.weight} kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Team; 