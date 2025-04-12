import styles from './AdminAds.module.scss'
import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';

const cx = classNames.bind(styles);

function AdminAds() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [adsList, setAdsList] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Fetch ads when component mounts
    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const response = await fetch('http://localhost:5000/ads');
            const data = await response.json();
            setAdsList(data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    const handleUpload = async () => {
        if (selectedImage) {
            try {
                // Convert image to base64
                const reader = new FileReader();
                reader.readAsDataURL(selectedImage);
                const base64Image = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                });

                // Prepare data to send
                const adData = {
                    image: base64Image,
                    fileName: selectedImage.name
                };

                if (editingId) {
                    // Update existing ad
                    const response = await fetch(`http://localhost:5000/ads/${editingId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(adData),
                    });
                    if (response.ok) {
                        const updatedAd = await response.json();
                        setAdsList(adsList.map(ad => 
                            ad._id === editingId ? updatedAd : ad
                        ));
                        setEditingId(null);
                    }
                } else {
                    // Create new ad
                    const response = await fetch('http://localhost:5000/ads', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(adData),
                    });
                    if (response.ok) {
                        const newAd = await response.json();
                        setAdsList([...adsList, newAd]);
                    }
                }

                setSelectedImage(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('Error uploading ad:', error);
            }
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/ads/${deleteId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAdsList(adsList.filter(ad => ad._id !== deleteId));
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleEdit = (ad) => {
        setEditingId(ad._id);
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
                        <div key={ad._id} className={cx('ad-item')}>
                            <img src={ad.image} alt={ad.fileName} />
                            <div className={cx('ad-actions')}>
                                <button onClick={() => handleEdit(ad)} className={cx('edit-button')}>
                                    Thay đổi
                                </button>
                                <button onClick={() => handleDeleteClick(ad._id)} className={cx('delete-button')}>
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