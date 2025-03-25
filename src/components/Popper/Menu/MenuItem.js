import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function MenuItem({ data }) {
    return (
        <Button className={cx('menu-item')} leftIcon={data.icon} to={data.to}>
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired
};

export default MenuItem;
