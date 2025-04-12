import { useState, useEffect } from 'react';
import styles from './Info.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '~/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPhone, faLocationDot, faCakeCandles, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import axios from 'axios';

const cx = classNames.bind(styles);

function Info() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        if (user) {
            setUserInfo({
                email: user.email || '',
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/auth/update', userInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data && response.data.success) {
                // Cập nhật thông tin user trong context
                updateUser(response.data.data);
                setIsEditing(false);
                alert('Cập nhật thông tin thành công!');
            } else {
                throw new Error('Cập nhật thông tin thất bại');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h2 className={cx('title')}>Thông tin cá nhân</h2>
                    {!isEditing ? (
                        <Button 
                            leftIcon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={() => setIsEditing(true)}
                            className={cx('edit-button')}
                        >
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <Button 
                            leftIcon={<FontAwesomeIcon icon={faSave} />}
                            onClick={handleSave}
                            className={cx('save-button')}
                        >
                            Lưu thay đổi
                        </Button>
                    )}
                </div>

                <div className={cx('profile-section')}>
                    <div className={cx('avatar-container')}>
                        <img 
                            src={user?.avatar || 'https://via.placeholder.com/150'} 
                            alt="Avatar" 
                            className={cx('avatar')} 
                        />
                        <label htmlFor="avatar-input" className={cx('upload-button')}>
                            Đổi ảnh đại diện
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            className={cx('file-input')}
                            hidden
                        />
                    </div>
                    <div className={cx('profile-info')}>
                        <span className={cx('member-since')}>Thành viên từ {new Date(user?.createdAt).toLocaleDateString()}</span>
                        <div className={cx('name-section')}>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userInfo.fullName}
                                    onChange={handleChange}
                                    className={cx('name-input')}
                                    placeholder="Nhập họ và tên"
                                />
                            ) : (
                                <span className={cx('name-input')}>{userInfo.fullName || 'Chưa cập nhật'}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('email-section')}>
                    <span className={cx('label')}>EMAIL</span>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            className={cx('input-field')}
                            placeholder="Nhập email"
                        />
                    ) : (
                        <span className={cx('value')}>{userInfo.email || 'Chưa cập nhật'}</span>
                    )}
                </div>

                <div className={cx('info-list')}>
                    <div className={cx('info-item')}>
                        <FontAwesomeIcon icon={faPhone} className={cx('icon')} />
                        <div className={cx('content')}>
                            <span className={cx('label')}>Số điện thoại:</span>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={userInfo.phoneNumber}
                                    onChange={handleChange}
                                    className={cx('input-field')}
                                    placeholder="Nhập số điện thoại"
                                />
                            ) : (
                                <span className={cx('value')}>{userInfo.phoneNumber || 'Chưa cập nhật'}</span>
                            )}
                        </div>
                    </div>

                    <div className={cx('info-item')}>
                        <FontAwesomeIcon icon={faLocationDot} className={cx('icon')} />
                        <div className={cx('content')}>
                            <span className={cx('label')}>Địa chỉ:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={userInfo.address}
                                    onChange={handleChange}
                                    className={cx('input-field')}
                                    placeholder="Nhập địa chỉ"
                                />
                            ) : (
                                <span className={cx('value')}>{userInfo.address || 'Chưa cập nhật'}</span>
                            )}
                        </div>
                    </div>

                    <div className={cx('info-item')}>
                        <FontAwesomeIcon icon={faCakeCandles} className={cx('icon')} />
                        <div className={cx('content')}>
                            <span className={cx('label')}>Ngày sinh:</span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={userInfo.dateOfBirth}
                                    onChange={handleChange}
                                    className={cx('input-field')}
                                />
                            ) : (
                                <span className={cx('value')}>
                                    {userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'Chưa cập nhật'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Info;