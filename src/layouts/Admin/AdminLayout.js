import AdminHeader from '~/components/Admin/AdminHeader';
import Sidebar from '~/components/Admin/Sidebar';
import styles from './AdminLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <AdminHeader />
            <div className={cx('container')}>
                <Sidebar />
                <main className={cx('content')}>{children}</main>
            </div>
        </div>
    );
}

export default AdminLayout;
