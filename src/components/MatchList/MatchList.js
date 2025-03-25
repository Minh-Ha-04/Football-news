import styles from './MatchList.module.scss'
import classNames from 'classnames/bind';
import Match from './Match/Match';
const cx= classNames.bind(styles)

    

function MatchList() {
    return ( <div >
        <h2 className={cx('desc')}>Kết quả vòng 29</h2>
        <header className={cx('header')}>Thứ 5, ngày 20/02/2025</header>
        <ul className={cx('match-list')}>
            <Match large></Match>
            <Match large></Match>

        </ul>
    </div> );
}

export default MatchList;