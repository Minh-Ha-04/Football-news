import { Outlet } from "react-router-dom";
import AdminHeader from "~/components/Admin/AdminHeader";
import Sidebar from "~/components/Admin/Sidebar";
import styles from "./AdminLayout.module.scss";

const AdminLayout = ({children}) => {
    return (
        <div className={styles.adminLayout}>
            <AdminHeader />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.content}>
                    {children}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
