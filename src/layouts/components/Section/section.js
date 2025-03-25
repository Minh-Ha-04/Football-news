import styles from './section.module.scss';
import classNames from 'classnames/bind';
import Team from '~/components/Team';
const cx = classNames.bind(styles);
function Section() {
    return <div className={cx('wrapper')}>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                <div className={cx('match')}>
                    <div className={cx('time')}>25/03/25  02:45</div>
                    <div className={cx('content')}>
                        <Team small></Team>
                        <Team small></Team>
                    </div>
                </div>
                
    </div>;
}

export default Section;
