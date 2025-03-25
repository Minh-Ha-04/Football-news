import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import ColLeft from '~/layouts/components/ColLeft';
import ColMiddle from '~/layouts/components/ColMiddle';
import ColRight from '~/layouts/components/ColRight';
import Button from '~/components/Button';
import Article from '~/components/Article';
import HotNews from '~/components/HotNews';
import Ads from '~/components/Ads';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('home')}>
            <div className={cx('content')}>
                <ColLeft>
                    <Article primary/>
                </ColLeft>
                <ColMiddle>
                    <Article primary />
                </ColMiddle>
                <ColRight>
                    <Article primary/>
                    <Article primary/>
                </ColRight>
            </div>
            <div className={cx('button')}>
                <Button rounded>Xem thêm</Button>
            </div>
            <Section />
            <div className={cx('wrapper')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                    <HotNews />
                    <HotNews />
                    <Button rounded>Xem thêm</Button>
                </div>
                <Ads />
            </div>
        </div>
    );
}

export default Home;
