import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function MenuItem({ data }) {
    const props = {
        className: cx('menu-item'),
        leftIcon: data.icon,
        onClick: data.onClick,
        to: data.to,
    };

    return <Button {...props}>{data.title}</Button>;
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default MenuItem;
