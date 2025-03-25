import styles from './ColRight.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function ColRight({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

ColRight.propTypes = {
    children: PropTypes.node,
};

export default ColRight;
