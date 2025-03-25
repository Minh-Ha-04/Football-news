import styles from './Team.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

const data = {
    id: '1',
    name: 'Arsenal',
    logo: 'https://resources.premierleague.com/premierleague/badges/50/t3@x2.png',
    played: '29',
    won: '21',
    drawm: '7',
    lost: '1',
    gf: '69',
    ga: '27',
    // gd : this.gf-this.ga
    // point :won*3+drawn
};

function Team({
    // data,
    small=false,
    reverse = false,
}) {
    return (
        <div className={cx('wrapper', { reverse,small })}>
            <img src={data.logo} alt={data.name} className={cx('team-logo')}></img>
            <span className={cx('team-name')}>{data.name}</span>
        </div>
    );
}

Team.propTypes = {
    reverse: PropTypes.bool,
};

export default Team;
