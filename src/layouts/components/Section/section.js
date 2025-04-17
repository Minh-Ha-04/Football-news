import { useEffect, useState } from 'react';
import styles from './section.module.scss';
import classNames from 'classnames/bind';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function Section() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/match');
                // Ensure we're accessing the data property from axios response
                const upcomingMatches = response.data.data  
                    .filter(match => match.status === 'upcoming')
                    .slice(0, 7);
                setMatches(upcomingMatches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3>Trận đấu nổi bật</h3>
                <Link  className={cx('view-all')} to={routes.matches}>Xem thêm</Link>
            </div>
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{
                    delay: 3000,
                }}
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
                className={cx('swiper-container')}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
            >
                {matches.map((match) => (
                    <SwiperSlide key={match._id}>
                        <div className={cx('match')}>
                            <div className={cx('time')}>
                                {new Date(match.matchDate).toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                            <div className={cx('content')}>
                                <div className={cx('team')}>
                                    <img src={match.logoHomeTeam} alt={match.homeTeam.name} className={cx('team-logo')} />
                                    <span className={cx('team-name')}>{match.homeTeam.name}</span>
                                </div>
                                <div className={cx('vs')}>VS</div>
                                <div className={cx('team')}>
                                    <img src={match.logoAwayTeam} alt={match.awayTeam.name} className={cx('team-logo')} />
                                    <span className={cx('team-name')}>{match.awayTeam.name}</span>
                                </div>
                            </div>
                            <div className={cx('stadium')}>{match.stadium}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Section;
