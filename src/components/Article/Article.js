import styles from './Article.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

const data = 
    {
        id: '1',
        image: 'https://cdn.24h.com.vn/upload/1-2025/images/2025-03-29/255x170/gettyimages-2182886629-612x612-495-1743242643-125-width740height495.jpg',
        title: 'Dự đoán tỷ số trận HOT: Man City dễ vào hiệp phụ tứ kết FA Cup, Barca thắng đậm derby',
    }

function Article({ to, href, primary = false, small = false, children, className, onClick, ...passProps }) {
    let Comp = 'div';
    const props = {
        onClick,
        ...passProps,
    };

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    const classes = cx({
        [className]: className,
        primary,
        small,
    });
    return (
        <Link to={routes.detail}>
            <Comp className={classes} {...props}>
                <img  src={data.image} alt={'ảnh'} className={cx('article-image')} />
                <h5 className={cx('article-title')}>{data.title}</h5>
            </Comp>
        </Link>
    );
}

export default Article;
