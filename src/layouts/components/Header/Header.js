import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBookBookmark, faEye, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Search from '../Search';
import SiteClub from '~/components/SiteClub';
import Menu from '~/components/Popper/Menu';
import { useAuth } from '~/contexts/AuthContext';
import config from '~/config';
const cx = classNames.bind(styles);

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(config.routes.home);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin tài khoản',
            to: config.routes.info,
        },
        {
            icon: <FontAwesomeIcon icon={faBookBookmark} />,
            title: 'Tin đã lưu',
            to: config.routes.saved,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} />,
            title: 'Tin đã xem',
            to: config.routes.viewed,
        },
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <SiteClub />
            <ul className={cx('inner')}>
                <Link to={config.routes.home}>
                    <img
                        className={cx('logo')}
                        src="https://www.premierleague.com/resources/rebrand/v7.153.55/i/elements/pl-main-logo.png"
                        alt="Premier League"
                    />
                </Link>
                <Link to={config.routes.home}>
                    <li className={cx('menu-item')}>Trang chủ</li>
                </Link>

                <Link to={config.routes.news}>
                    <li className={cx('menu-item')}>Tin tức</li>
                </Link>

                <Link to={config.routes.matches}>
                    <li className={cx('menu-item')}>Trận đấu</li>
                </Link>

                <Link to={config.routes.tables}>
                    <li className={cx('menu-item')}>Bảng xếp hạng</li>
                </Link>

                <Search />

                <div className={cx('action')}>
                    {isAuthenticated && user ? (
                        <Menu items={MENU_ITEMS}>
                            <div className={cx('user-info')}>
                                <img
                                    className={cx('user-avatar')}
                                    src={user.avatar || 'https://resources.premierleague.com/premierleague/photos/players/110x140/p118748.png'}
                                    alt={user.fullName || user.username}
                                />
                            </div>
                        </Menu>
                    ) : (
                        <Link to={config.routes.login} className={cx('login-button')}>
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </ul>
        </header>
    );
}

export default Header;
