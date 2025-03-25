import styles from './Image.module.scss'
import classNames from 'classnames/bind';

const cx= classNames.bind(styles)

function Image({children}) {
    return ( 
        <div className={cx('wrapper')}>
            <img src={children}>
            </img>
        </div>
    );
}

export default Image;