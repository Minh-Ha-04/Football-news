import styles from './AdminAds.module.scss';
import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;

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
            const response = await axios.get(`${API_URL}/ads`);
            setAdsList(response.data);
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
                const formData = new FormData();
                formData.append('image', selectedImage);
                
                // Thêm fileName vào formData
                const fileName = selectedImage.name; // Lấy tên file từ selectedImage
                formData.append('fileName', fileName); // Thêm tên file vào formData
    
                // Lấy token từ localStorage (hoặc từ sessionStorage, tùy vào cách bạn lưu trữ)
                const token = localStorage.getItem('token');  // Hoặc lấy từ sessionStorage nếu bạn dùng sessionStorage
    
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Thêm token vào header
                    }
                };
    
                if (editingId) {
                    // Cập nhật quảng cáo
                    const response = await axios.put(`${API_URL}/ads/${editingId}`, formData, config);
                    setAdsList(adsList.map(ad => 
                        ad._id === editingId ? response.data : ad
                    ));
                    setEditingId(null);
                } else {
                    // Tạo quảng cáo mới
                    const response = await axios.post(`${API_URL}/ads`, formData, config);
                    setAdsList([...adsList, response.data]);
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
            const token = localStorage.getItem('token');  // Lấy token từ localStorage
    
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                }
            };
    
            await axios.delete(`${API_URL}/ads/${deleteId}`, config);  // Thêm config vào yêu cầu DELETE
            setAdsList(adsList.filter(ad => ad._id !== deleteId));
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
        setPreviewUrl(`${API_URL}${ad.image}`);
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
                            <img src={`${API_URL}${ad.image}`} alt={ad.fileName}/>
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
