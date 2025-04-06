import styles from './AdminAds.module.scss'
import classNames from 'classnames/bind';
import { useState, useRef } from 'react';

const cx = classNames.bind(styles);

function AdminAds() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [adsList, setAdsList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    const handleUpload = () => {
        if (selectedImage) {
            const newAd = {
                id: Date.now(),
                image: previewUrl,
                fileName: selectedImage.name
            };

            if (editingId) {
                setAdsList(adsList.map(ad => 
                    ad.id === editingId ? newAd : ad
                ));
                setEditingId(null);
            } else {
                setAdsList([...adsList, newAd]);
            }

            setSelectedImage(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        setAdsList(adsList.filter(ad => ad.id !== deleteId));
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleEdit = (ad) => {
        setEditingId(ad.id);
        setPreviewUrl(ad.image);
        setSelectedImage({ name: ad.fileName });
    };

    return (
        <div className={cx('admin-ads')}>
            <div className={cx('upload-section')}>
                <h2>{editingId ? 'Thay đổi quảng cáo' : 'Thêm quảng cáo mới'}</h2>
                <div className={cx('upload-container')}>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        ref={fileInputRef}
                        className={cx('file-input')}
                    />
                    {previewUrl && (
                        <div className={cx('preview-container')}>
                            <img src={previewUrl} alt="Preview" className={cx('preview-image')} />
                        </div>
                    )}
                    <button 
                        onClick={handleUpload}
                        className={cx('upload-button')}
                        disabled={!selectedImage}
                    >
                        {editingId ? 'Cập nhật' : 'Tải lên'}
                    </button>
                </div>
            </div>

            <div className={cx('ads-list')}>
                <h2>Danh sách quảng cáo</h2>
                <div className={cx('ads-grid')}>
                    {adsList.map((ad) => (
                        <div key={ad.id} className={cx('ad-item')}>
                            <img src={ad.image} alt={ad.fileName} />
                            <div className={cx('ad-actions')}>
                                <button onClick={() => handleEdit(ad)} className={cx('edit-button')}>
                                    Thay đổi
                                </button>
                                <button onClick={() => handleDeleteClick(ad.id)} className={cx('delete-button')}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showConfirm && (
                <div className={cx('confirm-dialog')}>
                    <div className={cx('confirm-content')}>
                        <p>Bạn có chắc chắn muốn xóa quảng cáo này?</p>
                        <div className={cx('confirm-buttons')}>
                            <button onClick={handleConfirmDelete} className={cx('confirm-yes')}>
                                Có
                            </button>
                            <button onClick={handleCancelDelete} className={cx('confirm-no')}>
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminAds;