import styles from "./AdminHeader.module.scss";
import classNames from 'classnames/bind';

const cx= classNames.bind(styles)
const AdminHeader = () => {
    return (
        <header className={cx('header')}>
            <h1 className={cx('title')}>Bảng điều khiển</h1>
        </header>
    );
};

export default AdminHeader;
