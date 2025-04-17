import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Team.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Team() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/team/${id}`);
                if (response.data.success) {
                    setTeam(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching team:', err);
                setError('Không thể tải thông tin đội bóng');
                toast.error('Không thể tải thông tin đội bóng');
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
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
            <div className={cx('header')}>
                <div className={cx('logo')}>
                    <img src={team.logo} alt={team.name} />
                </div>
                <div className={cx('info')}>
                    <h1 className={cx('name')}>{team.name}</h1>
                    <p className={cx('stadium')}>Sân nhà: {team.stadium}</p>
                </div>
            </div>

            <div className={cx('stats')}>
                <h2 className={cx('title')}>Thống kê mùa giải</h2>
                <div className={cx('stats-grid')}>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Số trận</span>
                        <span className={cx('stat-value')}>{team.seasonStats.matchesPlayed}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Thắng</span>
                        <span className={cx('stat-value')}>{team.seasonStats.wins}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Hòa</span>
                        <span className={cx('stat-value')}>{team.seasonStats.draws}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Thua</span>
                        <span className={cx('stat-value')}>{team.seasonStats.losses}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Điểm</span>
                        <span className={cx('stat-value')}>{team.seasonStats.points}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Bàn thắng</span>
                        <span className={cx('stat-value')}>{team.seasonStats.goalsScored}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Bàn thua</span>
                        <span className={cx('stat-value')}>{team.seasonStats.goalsConceded}</span>
                    </div>
                    <div className={cx('stat-item')}>
                        <span className={cx('stat-label')}>Hiệu số</span>
                        <span className={cx('stat-value')}>{team.seasonStats.goalDifference}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team; 