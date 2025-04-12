import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import styles from './Login.module.scss'
import classNames from 'classnames/bind';
import { useAuth } from '~/contexts/AuthContext';
import config from '~/config';

const cx= classNames.bind(styles)
const Login = () => {
    const navigate = useNavigate();
    const { login: authLogin, register: authRegister } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ 
        username: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateLogin = () => {
        const newErrors = {};
        if (!form.username) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        }
        if (!form.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegister = () => {
        const newErrors = {};
        if (!form.username) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập';
        }
        if (!form.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        }
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (form.password && form.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isLogin) {
                if (!validateLogin()) {
                    setLoading(false);
                    return;
                }
                const response = await authLogin({
                    username: form.username,
                    password: form.password
                });
                if (response.success) {
                    navigate(config.routes.home);
                } else {
                    setErrors({ submit: response.message });
                }
            } else {
                if (!validateRegister()) {
                    setLoading(false);
                    return;
                }
                const response = await authRegister({
                    username: form.username,
                    password: form.password
                });
                if (response.success) {
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    setIsLogin(true);
                    setForm({ username: '', password: '', confirmPassword: '' });
                } else {
                    setErrors({ submit: response.message });
                }
            }
        } catch (error) {
            setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                    <div className={cx('header')}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</div>
                <div className={cx('content')}>
                    {errors.submit && <div className={cx('error')}>{errors.submit}</div>}
                    <form onSubmit={handleSubmit} className={cx('form')}>
                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-input', { error: errors.username })}
                                type="text"
                                name="username"
                                placeholder="Tên đăng nhập"
                                value={form.username}
                                onChange={handleChange}
                            />
                            {errors.username && <span className={cx('error-message')}>{errors.username}</span>}
                        </div>
                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-input', { error: errors.password })}
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                            />
                            {errors.password && <span className={cx('error-message')}>{errors.password}</span>}
                        </div>
                        {!isLogin && (
                            <div className={cx('form-group')}>
                                <input
                                    className={cx('form-input', { error: errors.confirmPassword })}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && (
                                    <span className={cx('error-message')}>{errors.confirmPassword}</span>
                                )}
                            </div>
                        )}
                        <Button 
                            className={cx('button')} 
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                        </Button>
                    </form>
                    <p className={cx('footer')}>
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                        <button 
                            className={cx('change')} 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrors({});
                            }}
                        >
                            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
