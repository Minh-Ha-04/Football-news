import styles from './UserLayout.module.scss';
import classNames from 'classnames/bind';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Userbar from '~/pages/User/Userbar';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function UserLayout({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className={cx('wrapper')}>
            <Header onLogout={handleLogout} />
            <div className={cx('container')}>
                <Userbar />
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default UserLayout;
