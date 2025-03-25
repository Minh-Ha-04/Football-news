import styles from './ColLeft.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function ColLeft({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

ColLeft.propTypes = {
    children: PropTypes.node,
};

export default ColLeft;
