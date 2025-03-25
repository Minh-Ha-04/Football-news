import classNames from 'classnames/bind';
import styles from './SearchItem.module.scss';
// import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function SearchItem({data}) {
    return <div className={cx('wrapper')}>
            <p className={cx('title')}>
                ketqua
            </p>
        </div>;
}

export default SearchItem;


