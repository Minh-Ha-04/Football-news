import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faFootball, faHome } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper, faSoccerBall } from '@fortawesome/free-regular-svg-icons';
import routes from '~/config/routes';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul className={styles.menu}>
                <li>
                    <Link to={routes.dashboard}>
                        <FontAwesomeIcon icon={faChartLine} /> Thống kê
                    </Link>
                </li>
                <li>
                    <Link to={routes.post}>
                        <FontAwesomeIcon icon={faNewspaper} /> Quản lý bài viết
                    </Link>
                </li>
                <li>
                    <Link to={routes.matchscore}>
                        <FontAwesomeIcon icon={faSoccerBall } /> Quản lý trận đấu
                    </Link>
                </li>
                <li>
                    <Link to={routes.home}>
                        <FontAwesomeIcon icon={faHome   } /> Trang chủ
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
