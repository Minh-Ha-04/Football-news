import styles from './Info.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Info() {
    const [avatar, setAvatar] = useState(
        'https://resources.premierleague.com/premierleague/photos/players/110x140/p118748.png',
    );

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={cx('content')}>
            <div className={cx('profile-section')}>
                <div className={cx('avatar-container')}>
                    <img src={avatar} alt="Avatar" className={cx('avatar')} />
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
                        <input type="text" defaultValue="Minh Hà Quang" className={cx('name-input')} />
                        <button className={cx('edit-button')}>
                            <i className="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <h1 className={cx('title')}>Quản lý tài khoản</h1>

            <div className={cx('email-section')}>
                <span className={cx('label')}>EMAIL</span>
                <span className={cx('value')}>quangminhh2004@gmail.com</span>
            </div>

            <h1 className={cx('title')}>Thông tin cá nhân</h1>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>HỌ VÀ TÊN</span>
                </div>
                <div className={cx('info-value')}>
                    <input type="text" defaultValue="Minh Hà Quang" className={cx('input-field')} />
                </div>
            </div>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>NGÀY SINH</span>
                </div>
                <div className={cx('info-value')}>
                    <input type="date" className={cx('input-field')} />
                </div>
            </div>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>GIỚI TÍNH</span>
                </div>
                <div className={cx('info-value')}>
                    <select className={cx('input-field', 'select-field')}>
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
                    <input type="tel" placeholder="Nhập số điện thoại" className={cx('input-field')} />
                </div>
            </div>

            <div className={cx('info-item')}>
                <div className={cx('info-label')}>
                    <span>ĐỊA CHỈ</span>
                </div>
                <div className={cx('info-value')}>
                    <input type="text" placeholder="Nhập địa chỉ" className={cx('input-field')} />
                </div>
            </div>

            <div className={cx('button-container')}>
                <button className={cx('save-button')}>Lưu thay đổi</button>
            </div>
        </div>
    );
}

export default Info;