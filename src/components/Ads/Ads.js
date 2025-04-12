import styles from './Ads.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);

function Ads() {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/ads');
                const data = response.data
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {ads.map((ad, index) => (
                <div key={ad._id || index} className={cx('ad-item')}>
                    <img src={ad.image} alt={ad.fileName} />
                </div>
            ))}
        </div>
    );
}

export default Ads;
