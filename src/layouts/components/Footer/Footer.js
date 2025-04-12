import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHome, faNewspaper, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);
function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('left')}>
                <img
                    src="https://www.premierleague.com/resources/rebrand/v7.153.55/i/favicon/favicon-128.png"
                    alt="Football Logo"
                    className={cx('logo-footer')}
                />
                <h3>Trang tin tức bóng đá hàng đầu</h3>
                <h4>Cập nhật kết quả, lịch thi đấu và tin tức mới nhất</h4>
            </div>
            <div className={cx('right')}>
                <ul className={cx('contact')}>
                    <Link to={routes.home} className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faHome} />
                        Trang chủ
                    </Link>
                    <Link to={routes.matches} className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faCalendar} />
                        Lịch thi đấu
                    </Link>
                    <Link to={routes.news} className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faNewspaper} />
                        Tin tức
                    </Link>
                </ul>

                <h3 className={cx('text-follow')}>Theo dõi chúng tôi</h3>
                <div className={cx('social')}>
                    <a href="https://www.facebook.com/quangminh.ha.2508" target='_blank' className={cx('social-item')}>
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://www.facebook.com/quangminh.ha.2508" target='_blank' className={cx('social-item')}>
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://www.instagram.com/quangminh25_08/" target='_blank' className={cx('social-item')}>
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://www.youtube.com/watch?v=zDNOhR-Ms-I"  target='_blank' className={cx('social-item')}>
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                </div>
            <div className="copyright">&copy; 2025 Bóng Đá VN. Mọi quyền được bảo lưu. | Điều khoản sử dụng</div>
            </div>

            {/* Bản quyền */}
        </footer>
    );
}

export default Footer;
