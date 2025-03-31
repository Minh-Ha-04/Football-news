import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBookBookmark, faEye, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Search from '../Search';
import SiteClub from '~/components/SiteClub';
import Menu from '~/components/Popper/Menu';
import config from '~/config';
const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faUser} />,
        title: 'Thông tin tài khoản',
    },
    {
        icon: <FontAwesomeIcon icon={faBookBookmark} />,
        title: 'Tin đã lưu',
    },
    {
        icon: <FontAwesomeIcon icon={faEye} />,
        title: 'Tin đã xem',
    },
    {
        icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
        title: 'Thoát tài khoản',
    },
];

function Header() {
    const location = useLocation();
    const isUserPage = location.pathname.startsWith('/user');
    const currentUser = isUserPage
        ? {
              name: 'Minh',
              avatar: 'https://resources.premierleague.com/premierleague/photos/players/110x140/p118748.png',
          }
        : false;

    return (
        <header className={cx('wrapper')}>
            <SiteClub></SiteClub>
            <ul className={cx('inner')}>
                <Link to={config.routes.home}>
                    <img
                        className={cx('logo')}
                        src="https://www.premierleague.com/resources/rebrand/v7.153.55/i/elements/pl-main-logo.png"
                        alt="Premier League Logo"
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
                    {currentUser ? (
                        <Menu items={MENU_ITEMS}>
                            <div className={cx('avatar')}>
                                <img
                                    src={currentUser.avatar}
                                    className={cx('avatar-user')}
                                    alt={currentUser.name}
                                ></img>
                            </div>
                        </Menu>
                    ) : (
                        <Button to="/login">Log in</Button>
                    )}
                </div>
            </ul>
        </header>
    );
}
export default Header;
