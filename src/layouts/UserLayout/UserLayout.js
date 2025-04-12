import styles from './UserLayout.module.scss';
import classNames from 'classnames/bind';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Userbar from '~/pages/User/Userbar';;

const cx = classNames.bind(styles);

function UserLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <Userbar />
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default UserLayout;
