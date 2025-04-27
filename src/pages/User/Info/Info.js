import styles from './Info.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';

const cx = classNames.bind(styles);

function Info() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        avatar: '',
        nickName :'',
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        gender: 'male'
    });

    useEffect(() => {
        if (user) {
            setUserInfo({
                avatar: user.avatar || 'https://resources.premierleague.com/premierleague/photos/players/110x140/p118748.png',
                nickName:user.nickName || '',
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                gender: user.gender || 'male'
            });
        }
    }, [user]);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo(prev => ({
                    ...prev,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

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
            
            // Convert dateOfBirth to ISO string if it exists
            const dateOfBirth = userInfo.dateOfBirth 
                ? new Date(userInfo.dateOfBirth).toISOString() 
                : null;

            const dataToSend = {
                ...userInfo,
                dateOfBirth
            };
            
            const response = await axios.put('http://localhost:5000/auth/me', dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data && response.data.success) {
                // Update the local user data with the response from server
                const updatedUser = {
                    ...response.data.data,
                    // Ensure dateOfBirth is properly formatted for display
                };
                updateUser(updatedUser);
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
        <div className={cx('content')}>
            <div className={cx('profile-section')}>
                <div className={cx('avatar-container')}>
                    <img src={userInfo.avatar} alt="Avatar" className={cx('avatar')} />
                    <div className={cx('avatar-upload')}>
                        <label htmlFor="avatar-input" className={cx('upload-button')}>
                            Đổi ảnh đại diện
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            className={cx('file-input')}
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </div>
                </div>
                <div className={cx('profile-info')}>
                    <span className={cx('member-since')}>Tên hiển thị</span>
                    <div className={cx('name-section')}>
                        <input 
                            type="text" 
                            name="nickName"
                            value={userInfo.nickName}
                            onChange={handleChange}
                            className={cx('name-input')} 
                        />
                    </div>
                </div>
            </div>

            <h1 className={cx('title')}>Quản lý tài khoản</h1>

            <div className={cx('email-section')}>
                <span className={cx('label')}>EMAIL</span>
                <div className={cx('info-value')}>
                    <input 
                        type="email" 
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        className={cx('input-field')} 
                    />
                </div>
            </div>

            <h1 className={cx('title')}>Thông tin cá nhân</h1>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>HỌ VÀ TÊN</span>
                </div>
                <div className={cx('info-value')}>
                    <input 
                        type="text" 
                        name="fullName"
                        value={userInfo.fullName}
                        onChange={handleChange}
                        className={cx('input-field')} 
                    />
                </div>
            </div>


            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>GIỚI TÍNH</span>
                </div>
                <div className={cx('info-value')}>
                    <select 
                        className={cx('input-field', 'select-field')}
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleChange}
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
            </div>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>SỐ ĐIỆN THOẠI</span>
                </div>
                <div className={cx('info-value')}>
                    <input 
                        type="tel" 
                        name="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại" 
                        className={cx('input-field')} 
                    />
                </div>
            </div>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>ĐỊA CHỈ</span>
                </div>
                <div className={cx('info-value')}>
                    <input 
                        type="text" 
                        name="address"
                        value={userInfo.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ" 
                        className={cx('input-field')} 
                    />
                </div>
            </div>

            <div className={cx('button-container')}>
                <button onClick={handleSave} className={cx('save-button')}>
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}

export default Info;