import styles from './Ads.module.scss';
import classNames from 'classnames/bind';
import ads from './ads-img.png';
const cx = classNames.bind(styles);
function Ads() {
    return (
        <div className={cx('wrapper')}>
            <img src={ads}></img>
        </div>
    );
}

export default Ads;
