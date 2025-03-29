import { Link } from 'react-router-dom';
import styles from './Userbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBookBookmark,faEye,faUser} from '@fortawesome/free-solid-svg-icons';
import routes from '~/config/routes';
import classNames from 'classnames/bind';
const cx=classNames.bind(styles)

const Sidebar = () => {
    return (
        <div className={cx('sidebar')}>
            <ul className={cx('menu')}>
                <li>
                    <Link to={routes.info}>
                        <FontAwesomeIcon icon={faUser} /> Thông tin tài khoản
                    </Link>
                </li>
                <li>
                    <Link to={routes.saved}>
                        <FontAwesomeIcon icon={faBookBookmark} /> Bài viết đã lưu
                    </Link>
                </li>
                <li>
                    <Link to={routes.viewed}>
                        <FontAwesomeIcon icon={faEye } /> Bài viết đã xem
                    </Link>
                </li>
                <li>
                    <Link to={routes.home}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> Đăng xuất
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
