import styles from './Article.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

const data = {
    id :'1',
    image: 'https://cdn.24h.com.vn/upload/1-2025/images/2025-03-21/255x170/sdafsdsd-1742543062-530-width740height495.jpg',
    title: 'Trực tiếp bóng đá Thái Lan - Afghanistan: Phép thử cho  (Giao hữu)',
};

function Article({
    to,
    href,
    primary = false,
    small = false,
    children,
    className,
    onClick,
    ...passProps
}) {
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
        <Comp className={classes} {...props}>
            <img src={data.image} alt={'ảnh'} className={cx('article-image')} />
            <h5 className={cx('article-title')}>{data.title}</h5>
        </Comp>
    );
}

export default Article;
