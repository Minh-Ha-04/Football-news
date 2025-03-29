import classNames from 'classnames/bind';
import styles from './SiteClub.module.scss';
import Data from '~/Data';
const cx = classNames.bind(styles);
const data = Data;
function SiteClub() {
    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Các đội bóng</h3>
            <ul className={cx('logoContainer')}>
                {data
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team,index) => (
                        <li className={cx('logo')} key={index}>
                            <img src={team.image} alt={team.name}></img>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default SiteClub;
