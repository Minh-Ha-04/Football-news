import styles from './Viewed.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';

const cx = classNames.bind(styles);

function Viewed() {
    // Giả lập dữ liệu theo ngày
    const articlesByDate = {
        'Hôm nay': [
            { id: 1, title: 'Tin tức 1', time: '2 giờ trước' },
            { id: 2, title: 'Tin tức 2', time: '5 giờ trước' },
        ],
        'Hôm qua': [
            { id: 3, title: 'Tin tức 3', time: '1 ngày trước' },
            { id: 4, title: 'Tin tức 4', time: '1 ngày trước' },
        ],
        'Tuần này': [
            { id: 5, title: 'Tin tức 5', time: '2 ngày trước' },
            { id: 6, title: 'Tin tức 6', time: '3 ngày trước' },
        ],
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Tin đã xem</div>
            <div className={cx('content')}>
                {Object.entries(articlesByDate).map(([date, articles]) => (
                    <div key={date} className={cx('date-section')}>
                        <div className={cx('date-header')}>{date}</div>
                        <div className={cx('articles')}>
                            {articles.map((article) => (
                                <div key={article.id} className={cx('article-item')}>
                                    <HotNews />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Viewed;
