import { useState, useEffect } from 'react';
import styles from './HotNews.module.scss';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function HotNews({article}) {


    return (
        <div className={cx('hot-news-container')}>          
                <Link key={article._id} to={routes.detail.replace(':slug', article.slug)}>
                    <div className={cx('hot-news-item')}>
                        <div className={cx('image-container')}>
                            <img 
                                src={article.image || 'https://via.placeholder.com/255x170'} 
                                alt={article.title} 
                                className={cx('image')} 
                            />
                        </div>
                        <div className={cx('content')}>
                            <h3 className={cx('title')}>{article.title}</h3>
                            <p className={cx('description')}>{article.description}</p>
                            <div className={cx('time')}>
                                {new Date(article.createdAt).toLocaleDateString('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </Link>
        </div>
    );
}

export default HotNews;
