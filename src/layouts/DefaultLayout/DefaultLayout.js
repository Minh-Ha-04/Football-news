import Header from '~/layouts/components/Header';
import PropTypes from 'prop-types';
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import Footer from '~/layouts/components/Footer';
import BackToTop from '~/components/BackToTop/BackToTop';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className="content">{children}</div>
            <BackToTop />
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
