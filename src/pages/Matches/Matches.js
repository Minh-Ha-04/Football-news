import styles from './Matches.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Ads from '~/components/Ads';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import MatchList from '~/components/MatchList';
import Article from '~/components/Article';
import Button from '~/components/Button';
import HotNews from '~/components/HotNews';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = classNames.bind(styles);

function Matches() {
    return (
        <div className={cx('matches')}>
            <Section />

            <div className={cx('container')}>
                <div className={cx('content')}>
                    <time className={cx('time-post')}>Thứ Bảy, ngày 22/03/2025 03:44 AM (GMT+7)</time>
                    <h1 className={cx('title')}>Kết quả BÓNG ĐÁ giải Ngoại Hạng Anh 2024/2025 mới nhất</h1>
                    <p className={cx('desc')}>
                        Trân trọng giới thiệu tới độc giả kết quả thi đấu bóng đá Anh giải Ngoại Hạng Anh - Premier
                        League 2024/2025 nhanh chính xác nhất.
                    </p>
                    <div className={cx('result-list')}>
                        <header className={cx('header-result')}>
                            <div className={cx('left-header')}>
                                <img
                                    className={cx('logo-header-result')}
                                    src="https://www.premierleague.com/resources/rebrand/v7.153.55/i/elements/pl-main-logo.png"
                                ></img>
                                <ul className={cx('header-nav')}>
                                    <li class={cx('header-item')}>
                                        <FontAwesomeIcon icon={faCalendar} /> Lịch thi đấu
                                    </li>
                                    <li class={cx('header-item')}>
                                        <Link to={routes.tables}><FontAwesomeIcon icon={faTrophy} /> Bảng xếp hạng</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={cx('right-header')}>Mùa giải 2024/2025</div>
                        </header>
                        <div className={cx('list-match')}>
                            <MatchList />
                            <MatchList />
                            <MatchList />
                            <MatchList />
                            <MatchList />
                        </div>
                    </div>
                    <div className={cx('hotnews')}>
                        <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                        <HotNews />
                        <HotNews />
                        <div className={cx('button')}><Button rounded>Xem thêm</Button></div>
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

export default Matches;
