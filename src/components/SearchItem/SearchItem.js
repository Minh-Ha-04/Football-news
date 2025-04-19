import classNames from 'classnames/bind';
import styles from './SearchItem.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function SearchItem({ title,  image,slug}) {
    return (
        <Link to={`/detail/${slug}`} className={cx('wrapper')}>
            <div className={cx('content')}>
                {image && (
                    <div className={cx('image')}>
                        <img src={image} alt={title} />
                    </div>
                )}
                    <h4 className={cx('title')}>{title}</h4>
            </div>
        </Link>
    );
}

SearchItem.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
};

export default SearchItem;


