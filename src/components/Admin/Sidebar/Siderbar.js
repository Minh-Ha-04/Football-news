import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHome, faPersonRunning, faStar, faUser, faComment } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper, faSoccerBall } from '@fortawesome/free-regular-svg-icons';
import routes from '~/config/routes';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Sidebar = () => {
    return (
        <div className={cx('sidebar')}>
            <ul className={cx('menu')}>
                <li>
                    <Link to={routes.dashboard}>
                        <FontAwesomeIcon icon={faChartLine} /> Cập nhật bảng xếp hạng
                    </Link>
                </li>
                <li>
                    <Link to={routes.post}>
                        <FontAwesomeIcon icon={faNewspaper} /> Quản lý bài viết
                    </Link>
                </li>
                <li>
                    <Link to={routes.matchscore}>
                        <FontAwesomeIcon icon={faSoccerBall} /> Quản lý trận đấu
                    </Link>
                </li>
                <li>
                    <Link to={routes.adminplayer}>
                        <FontAwesomeIcon icon={faPersonRunning} /> Quản lý cầu thủ
                    </Link>
                </li>
                <li>
                    <Link to={routes.ads}>
                        <FontAwesomeIcon icon={faStar} /> Quản lý quảng cáo
                    </Link>
                </li>
                <li>
                    <Link to={routes.manager}>
                        <FontAwesomeIcon icon={faUser} /> Quản lý người dùng
                    </Link>
                </li>
                <li>
                    <Link to={routes.comment}>
                        <FontAwesomeIcon icon={faComment} /> Quản lý góp ý
                    </Link>
                </li>
                
                <li>
                    <Link to={routes.home}>
                        <FontAwesomeIcon icon={faHome} /> Trang chủ
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
