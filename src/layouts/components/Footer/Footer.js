import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHome, faNewspaper, faPhone } from '@fortawesome/free-solid-svg-icons';
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
                    <li className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faHome} />
                        Trang chủ
                    </li>
                    <li className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faCalendar} />
                        Lịch thi đấu
                    </li>
                    <li className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faNewspaper} />
                        Tin tức
                    </li>
                    <li className={cx('contact-item')}>
                        <FontAwesomeIcon icon={faPhone} />
                        Liên hệ
                    </li>
                </ul>

                <h3 className={cx('text-follow')}>Theo dõi chúng tôi</h3>
                <div className={cx('social')}>
                    <a href="#" className={cx('social-item')}>
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="#" className={cx('social-item')}>
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="#" className={cx('social-item')}>
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="#" className={cx('social-item')}>
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
