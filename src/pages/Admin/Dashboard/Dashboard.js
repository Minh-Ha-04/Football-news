import { faNewspaper, faUser } from '@fortawesome/free-regular-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <h2>Thống kê tổng quan</h2>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <FontAwesomeIcon icon={faUser} />
                    <p>Người dùng: 1500</p>
                </div>
                <div className={styles.statItem}>
                    <FontAwesomeIcon icon={faNewspaper} />
                    <p>Bài viết: 120</p>
                </div>
                <div className={styles.statItem}>
                    <FontAwesomeIcon icon={faChartLine} />
                    <p>Lượt truy cập: 50,000</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
