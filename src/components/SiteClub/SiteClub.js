import classNames from 'classnames/bind';
import styles from './SiteClub.module.scss'

const cx=classNames.bind(styles);

function SiteClub() {
    return ( <div className={cx('wrapper')}>
        <h4>Các đội bóng</h4>
    </div> );
}

export default SiteClub;