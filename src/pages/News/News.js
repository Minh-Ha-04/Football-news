import styles from './News.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import HotNews from '~/components/HotNews';
import Button from '~/components/Button';
import Article from '~/components/Article';
import Ads from '~/components/Ads';
const cx = classNames.bind(styles);

function News() {
    return (
        <div className={cx('news')}>
            <Section />
            <div className={cx('container')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                    <HotNews />
                    <div className={cx('button')}>
                        <Button rounded>Xem thêm</Button>
                    </div>
                </div>
                <div className={cx('right')}>
                    <Ads />
                    <div className={cx('more')}>
                        <Button text>Tin Tức</Button>
                        <Article small></Article>
                        <Article small></Article>
                        <Article small></Article>
                        <Article small></Article>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default News;
