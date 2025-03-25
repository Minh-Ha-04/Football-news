import styles from './ColMiddle.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);
function ColMiddle({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

ColMiddle.propTypes = {
    children: PropTypes.node,
};

export default ColMiddle;
