import styles from './Match.module.scss';
import classNames from 'classnames/bind';
import Team from '~/components/Team';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

const data = {
    date: '02:00 17/03',
    score: '2-1',
};

function Match({ 
    small = false,
     large = false,
     }) {
    const classes = cx({
        large,
        small,
    });

    return (
            <div className={classes}>
                <div className={cx('time')}>{data.date}</div>
                <Team reverse />
                <Button small>{data.score}</Button>
                <Team />
            </div>
    );
}

export default Match;
