import { useState, useEffect } from 'react';
import styles from './Tables.module.scss'
import classNames from 'classnames/bind';
import axios from 'axios';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL 
function Tables() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_URL}/team`);
                if (response.data.success) {
                    // Sắp xếp theo điểm số giảm dần
                    const sortedTeams = response.data.data.sort((a, b) => {
                        if (b.seasonStats.points !== a.seasonStats.points) {
                            return b.seasonStats.points - a.seasonStats.points;
                        }
                        // Nếu điểm bằng nhau, sắp xếp theo hiệu số bàn thắng
                        return b.seasonStats.goalDifference - a.seasonStats.goalDifference;
                    });
                    setTeams(sortedTeams);
                } else {
                    setError('Không thể tải dữ liệu bảng xếp hạng');
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bảng xếp hạng:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return <div className={cx('loading')}>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('bxh')}>Bảng Xếp Hạng</h2>
            <table className={cx('tables')}>
                <thead>
                    <tr className={cx('header')}>
                        <th className={cx('header-item')}>TT</th>
                        <th className={cx('header-item')}>Đội</th>
                        <th className={cx('header-item', 'match-column')}>Trận</th>
                        <th className={cx('header-item')}>Thắng</th>
                        <th className={cx('header-item')}>Hòa</th>
                        <th className={cx('header-item')}>Thua</th>
                        <th className={cx('header-item')}>Bàn thắng</th>
                        <th className={cx('header-item')}>Bàn thua</th>
                        <th className={cx('header-item')}>Hiệu số</th>
                        <th className={cx('header-item', 'score-column')}>Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key={team._id} className={cx('table-row')}>
                            <td className={cx('table-cell')}>{index + 1}</td>
                            <td className={cx('table-cell', 'team-name')}>
                                <Link to={`/team/${team._id}`} className={cx('team-link')}>
                                    <img src={`${API_URL}${team.logo}`} alt={team.name} className={cx('logo')} />
                                    <span>{team.name}</span>
                                </Link>
                            </td>
                            <td className={cx('table-cell', 'match-column')}>
                                {team.seasonStats.matchesPlayed}
                            </td>
                            <td className={cx('table-cell')}>{team.seasonStats.wins}</td>
                            <td className={cx('table-cell')}>{team.seasonStats.draws}</td>
                            <td className={cx('table-cell')}>{team.seasonStats.losses}</td>
                            <td className={cx('table-cell')}>{team.seasonStats.goalsScored}</td>
                            <td className={cx('table-cell')}>{team.seasonStats.goalsConceded}</td>
                            <td className={cx('table-cell')}>{team.seasonStats.goalDifference}</td>
                            <td className={cx('table-cell', 'score-column')}>{team.seasonStats.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tables;
