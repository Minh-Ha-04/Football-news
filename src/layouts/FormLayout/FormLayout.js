import { useState } from 'react';
import Button from '~/components/Button';
import styles from './FormLayout.module.scss'
import classNames from 'classnames/bind';

const cx= classNames.bind(styles)
const FormLayout = ({ onSubmit }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', password: '', name: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form, isLogin);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                    <div className={cx('header')}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</div>
                <div className={cx('content')}>
                    <form onSubmit={handleSubmit} className={cx('form')}>
                        {!isLogin && (
                            <input 
                                className={cx('form-input')}
                                type="text"
                                name="name"
                                placeholder="Tên của bạn"
                                value={form.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        )}
                        <input 
                            className={cx('form-input')}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            className={cx('form-input')}
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <Button className={cx('button')}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</Button>
                    </form>
                    <p className={cx('footer')}>
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                        <button className={cx('change')} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormLayout;
