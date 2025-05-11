import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBookmark, faEye, faUser, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Search from '../Search';
import SiteClub from '~/components/SiteClub';
import Menu from '~/components/Popper/Menu';
import { useAuth } from '~/contexts/AuthContext';
import config from '~/config';
const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;
function Header() {
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
        ...(user?.role === 'user' ? [{
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin tài khoản',
            to: config.routes.info,
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            title: 'Tin đã lưu',
            to: config.routes.saved,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} />,
            title: 'Tin đã xem',
            to: config.routes.viewed,
        }] :[]) 
        ,
        ...(user?.role === 'admin' ? [
            {
                icon: <FontAwesomeIcon icon={faGaugeHigh} />,
                title: 'Quản trị',
                to: config.routes.dashboard,
            }
        ] : []),
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: 'Đăng xuất',
            onClick: handleLogout,
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <SiteClub />
            <ul className={cx('inner')}>
                <Link to={config.routes.home}>
                    <img
                        className={cx('logo')}
                        src={`${API_URL}/uploads/users/default-avatar.png`}
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
                                    src={`${API_URL}${user.avatar}`}
                                    alt={"avatar"}
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
