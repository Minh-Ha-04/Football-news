import { useLocation} from 'react-router-dom';
import styles from './Result.module.scss';
import classNames from 'classnames/bind';
import HotNews from '~/components/HotNews';

const cx = classNames.bind(styles);

function Result() {
    const location = useLocation();
    const { results, searchTerm } = location.state || { results: [], searchTerm: '' };




    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Kết quả tìm kiếm cho "{searchTerm}"</h2>
            <div className={cx('results')}>
                {results.map((article) => (
                    <HotNews key={article._id} article={article} />
                ))}
            </div>
        </div>
    );
}

export default Result;