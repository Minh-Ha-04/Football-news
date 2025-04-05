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
import { useState,useEffect } from 'react';
const cx = classNames.bind(styles);

function Home() {
    const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/articles") // URL API từ backend
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Lỗi API:", err));
  }, []);
    return (
        <div className={cx('home')}>
            <div>
      <h2>Danh sách bài viết</h2>
      <ul>
        {data.map((article) => (
          <li >
            <h3>{article.title}</h3>
            <img src={article.image}></img>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
            <div className={cx('content')}>
                <ColLeft>
                    <Article primary/>
                    <Article primary />

                </ColLeft>
                <ColMiddle>
                    <Article primary />
                </ColMiddle>
                <ColRight>
                    <Article primary />
                    <Article primary />
                </ColRight>
            </div>
            <Section /> 
            <div className={cx('wrapper')}>
                <div className={cx('hotnews')}>
                    <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                    <HotNews />
                    <HotNews />
                    <HotNews />
                    <HotNews />
                    <HotNews />
                    <HotNews /> 
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
