import styles from './Article.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function Article({ data, primary = false, small = false, className, onClick, ...passProps }) {
    if (!data) return null;

    return (
        <Link to={`/detail/${data.slug}`} className={cx('wrapper', {
            [className]: className,
            primary,
            small,
        })} {...passProps}>
            <div className={cx('article-container')}>
                <img src={data.image} alt={data.title} className={cx('article-image')} />
                <div className={cx('article-content')}>
                    <div className={cx('article-category')}>
                        {data.category && `(${data.category})`}
                    </div>
                    <h3 className={cx('article-title')}>{data.title}</h3>
                    {data.description && (
                        <p className={cx('article-description')}>{data.description}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default Article;
