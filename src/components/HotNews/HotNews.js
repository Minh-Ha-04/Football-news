import styles from './HotNews.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const data = {
    image: 'https://cdn.24h.com.vn/upload/1-2025/images/2025-03-21/255x170/--dfasfasdf-1742553985-870-width740height495.jpg',
    title: 'Ngôi sao MU khiến Ronaldo ôm hận, Fernandes khó đá nếu sắm vai kép phụ',
    des: 'Những ngôi sao đang thi đấu tại Ngoại hạng Anh tiếp tục thăng hoa trong màu áo đội tuyển quốc gia.',
};

function HotNews() {
    return (
        <div className={cx('HotNews')}>
            <img src={data.image} alt={'ảnh'} className={cx('image')} />
            <div className={cx('wrapper')}>
                <h3 className={cx('title')}>{data.title}</h3>
                <div className={cx('des')}>{data.des}</div>
            </div>
        </div>
    );
}

export default HotNews;
