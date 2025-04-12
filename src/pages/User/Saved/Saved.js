import styles from './Saved.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark,faShare } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import HotNews from '~/components/HotNews';
const cx= classNames.bind(styles)
function Saved() {
    return ( 
        <div className='wrapper'>
            <div className={cx('title')}>Tin đã lưu</div>
            <div className={cx('content')}>
                <div className={cx('item')}><HotNews/>
                <div className={cx('media')}>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faBookBookmark} />
                            Bỏ lưu
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>
                </div>
                <div className={cx('item')}><HotNews/>
                <div className={cx('media')}>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faBookBookmark} />
                            Bỏ lưu
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>
                </div>
                <div className={cx('item')}><HotNews/>
                <div className={cx('media')}>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faBookBookmark} />
                            Bỏ lưu
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Saved;