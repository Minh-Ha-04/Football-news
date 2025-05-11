import styles from './Info.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import axios from 'axios';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;
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
                avatar: user.avatar || 'upload/default-avatar.png',
                nickName:user.nickName || '',
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                gender: user.gender || 'male'
            });
        }
    }, [user]);

    const handleUploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append('image', file);       // phải là 'image' vì backend dùng upload.single('image')
        formData.append('type', 'user');      // để multer lưu vào đúng thư mục
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.put(`${API_URL}/auth/me?type=user`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data && response.data.success) {
                const updatedUser = response.data.data;
                updateUser(updatedUser);
                setUserInfo(prev => ({ ...prev, avatar: updatedUser.avatar }));
                alert('Cập nhật ảnh đại diện thành công!');
            }
        } catch (err) {
            console.error('Upload avatar failed:', err);
            alert('Tải ảnh thất bại');
        }
    };
    
    

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserInfo(prev => ({
                ...prev,
                avatar: imageUrl
            }));
    
            handleUploadAvatar(file);  // Gọi hàm upload khi chọn ảnh mới
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
            
            const response = await axios.put(`${API_URL}/auth/me`, dataToSend, {
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
                    <img src={`${API_URL}${userInfo.avatar}`} alt="Avatar" className={cx('avatar')} />
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