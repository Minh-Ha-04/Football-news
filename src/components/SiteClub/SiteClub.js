import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SiteClub.module.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SiteClub() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/team');
                if (response.data.success) {
                    setTeams(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Không thể tải danh sách đội bóng');
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <h3 className={cx('title')}>Các đội bóng</h3>
                <div className={cx('loading')}>Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('wrapper')}>
                <h3 className={cx('title')}>Các đội bóng</h3>
                <div className={cx('error')}>{error}</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Các đội bóng</h3>
            <ul className={cx('logoContainer')}>
                {teams
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team) => (
                        <li className={cx('logo')} key={team._id}>
                            <Link to={`/team/${team._id}`}>
                                <img src={team.logo} alt={team.name} />
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default SiteClub;
