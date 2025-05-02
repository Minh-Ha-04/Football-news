import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Team.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers,

} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const API_URL=process.env.REACT_APP_API_URL;
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
                const teamResponse = await axios.get(`${API_URL}/team/${id}`);
                if (teamResponse.data.success) {
                    setTeam(teamResponse.data.data);
                }

                // Lấy danh sách cầu thủ của đội
                const playersResponse = await axios.get(`${API_URL}/player/team/${id}`);
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
                <div className={cx('header-left')}>
                    <div className={cx('logo-container')}>
                        <img 
                            src={`${API_URL}${team.logo}`} 
                            alt={team.name} 
                            className={cx('logo')}
                        />
                    </div>
                    <div className={cx('team-info')}>
                        <h1 className={cx('name')}>{team.name}</h1>
                    </div>
                </div>
                <div className={cx('header-right')}>
                    <h2 className={cx('section-title')}>Thống kê mùa giải</h2>
                    <div className={cx('stats-grid')}>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Số trận</span>
                            <span className={cx('stat-value')}>{team.seasonStats.matchesPlayed}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Thắng</span>
                            <span className={cx('stat-value')}>{team.seasonStats.wins}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Hòa</span>
                            <span className={cx('stat-value')}>{team.seasonStats.draws}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Thua</span>
                            <span className={cx('stat-value')}>{team.seasonStats.losses}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Điểm</span>
                            <span className={cx('stat-value')}>{team.seasonStats.points}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Bàn thắng</span>
                            <span className={cx('stat-value')}>{team.seasonStats.goalsScored}</span>
                        </div>
                        <div className={cx('stat-card')}>
                            <span className={cx('stat-label')}>Bàn thua</span>
                            <span className={cx('stat-value')}>{team.seasonStats.goalsConceded}</span>
                        </div>
                        <div className={cx('stat-card')}>
                        <span className={cx('stat-label')}>Hiệu số</span>
                        <span className={cx('stat-value')}>{team.seasonStats.goalDifference}</span>
                            
                        </div>
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
                            <div className={cx('player-bg')}>
                                <div className={cx('player-info')}>
                                    <div>
                                        <span className={cx('info-label')}>Vị trí</span>
                                        <span className={cx('info-value')}>{player.position}</span>
                                    </div>
                                    <div>
                                        <span className={cx('info-label')}>Số áo</span>
                                        <span className={cx('info-value')}>{player.number}</span>
                                    </div>
                                    <div>
                                        <span className={cx('info-label')}>Chiều cao</span>
                                        <span className={cx('info-value')}>{player.height}</span>
                                    </div>
                                    <div>
                                        <span className={cx('info-label')}>Cân nặng</span>
                                        <span className={cx('info-value')}>{player.weight}</span>
                                    </div>
                                </div>
                                <div className={cx('player-image')}>
                                    <img src={`${API_URL}${player.image}`} alt={player.name} />
                                </div>
                            </div>
                            <div className={cx('player-name-block')}>
                                <span className={cx('player-name-bold')}>{player.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Team; 