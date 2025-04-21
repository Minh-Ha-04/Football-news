import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Result.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';

const cx = classNames.bind(styles);

function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const { results,teamInfo,searchTerm } = location.state || {};

    const handleTeamClick = (team) => {
        navigate(`/team/${team._id}`, { state: { team } });
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Kết quả tìm kiếm cho "{searchTerm}"</h2>
                {teamInfo && (
                    <div className={cx('team-info')} onClick={() => handleTeamClick(teamInfo)}>
                        <img src={teamInfo.logo} alt={teamInfo.name} className={cx('team-logo')} />
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
                    {results && results.map((article) => (
                        <HotNews
                            key={article._id}
                            article={article}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Result;