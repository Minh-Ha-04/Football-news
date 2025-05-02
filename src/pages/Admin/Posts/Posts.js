import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import styles from './Posts.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const API_URL=process.env.REACT_APP_API_URL
const cx = classNames.bind(styles);

export default function Posts() {
    const { register, handleSubmit, setValue } = useForm();
    const [preview, setPreview] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [articles, setArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);

    // Lấy danh sách đội bóng
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${API_URL}/team`);
                if (response.data.success) {
                    setTeams(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đội bóng:', error);
            }
        };
        fetchTeams();
    }, []);

    // Lấy danh sách bài viết với phân trang
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${API_URL}/articles?page=${currentPage}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data) {
                    setArticles(response.data.articles);
                    setTotalPages(response.data.totalPages);
                    setTotalArticles(response.data.total);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
                alert('Không thể tải danh sách bài viết');
            }
        };
        fetchArticles();
    }, [currentPage]);

    // Xem ảnh
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => {
            setValue('image', files[0]);
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        },
    });

    // Xử lý chọn/bỏ chọn tag
    const handleTagToggle = (name) => {
        setSelectedTags(prev => {
            if (prev.includes(name.toLowerCase())) {
                return prev.filter(tag => tag !== name.toLowerCase());
            } else {
                return [...prev, name.toLowerCase()];
            }
        });
    };

    // Xử lý sửa bài viết
    const handleEdit = async (article) => {
        setEditingArticle(article);
        setValue('title', article.title);
        setValue('description', article.description);
        setValue('content', article.content);
        
        // Hiển thị các tag đã chọn
        if (article.tags && article.tags.length > 0) {
            const lowercaseTags = article.tags.map(tag => tag.toLowerCase());
            setSelectedTags(lowercaseTags);
        } else {
            setSelectedTags([]);
        }
        
        if (article.image) {
            setPreview(`${API_URL}${article.image}`);
            // Tạo một File object từ URL ảnh để giữ lại ảnh cũ
            try {
                const response = await axios.get(`${API_URL}${article.image}`, {
                    responseType: 'blob'
                });
                const file = new File([response.data], 'current-image.jpg', { type: response.data.type });
                setValue('image', file);
            } catch (error) {
                console.error('Lỗi khi tải ảnh:', error);
            }
        }
    };

    // Xử lý xóa bài viết
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const response = await axios.delete(`${API_URL}/articles/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data) {
                    // Refresh articles list
                    const articlesResponse = await axios.get(`${API_URL}/articles?page=${currentPage}&limit=10`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setArticles(articlesResponse.data.articles);
                    setTotalPages(articlesResponse.data.totalPages);
                    setTotalArticles(articlesResponse.data.total);
                    alert('Xóa bài viết thành công!');
                }
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                alert('Có lỗi xảy ra khi xóa bài viết');
            }
        }
    };

    // Xử lý submit form
    const onSubmit = async (data) => {
        try {
            const formDataToSend = new FormData();
            
            // Thêm các trường dữ liệu vào FormData
            formDataToSend.append('title', data.title);
            formDataToSend.append('description', data.description);
            formDataToSend.append('content', data.content);
            formDataToSend.append('tags', JSON.stringify(selectedTags.map(tag => tag.toLowerCase())));
            
            // Thêm ảnh nếu có
            if (data.image) {
                formDataToSend.append('image', data.image);
            }

            let response;
            if (editingArticle) {
                // Update existing article
                response = await axios.put(`${API_URL}/articles/${editingArticle._id}`, formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Create new article
                response = await axios.post(`${API_URL}/articles`, formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            if (response.data) {
                alert(editingArticle ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết thành công!');
                // Reset form
                setValue('title', '');
                setValue('description', '');
                setValue('content', '');
                setPreview(null);
                setSelectedTags([]);
                setEditingArticle(null);
                
                // Refresh articles list
                const articlesResponse = await axios.get(`${API_URL}/articles?page=${currentPage}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setArticles(articlesResponse.data.articles);
                setTotalPages(articlesResponse.data.totalPages);
                setTotalArticles(articlesResponse.data.total);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra khi ' + (editingArticle ? 'cập nhật' : 'đăng') + ' bài viết');
        }
    };

    return (
        <div className={cx('posts')}>
            <h2>{editingArticle ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
            <form className={cx('wrapper')} onSubmit={handleSubmit(onSubmit)}>
                <input {...register('title')} placeholder="Tiêu đề bài viết" className={cx('title')} />
                <input {...register('description')} placeholder="Mô tả" className={cx('description')} />
                <input {...register('content')} placeholder="Nội dung bài viết" className={cx('content')} />
                
                {/* Phần chọn tag */}
                <div className={cx('tagsSection')}>
                    <h3>Chọn đội bóng liên quan</h3>
                    <div className={cx('tagsContainer')}>
                        {teams.map(team => (
                            <button
                                key={team._id}
                                type="button"
                                className={cx('tagButton', { 
                                    selected: selectedTags.includes(team.name.toLowerCase()) 
                                })}
                                onClick={() => handleTagToggle(team.name)}
                            >
                                <img src={`${API_URL}${team.logo}`} alt={team.name} className={cx('teamLogo')} />
                                {team.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div {...getRootProps()} className={cx('uploadSection')}>
                    <input {...getInputProps()} />
                    <div className={cx('picture')}>
                        {preview ? (
                            <div className={cx('imagePreview')}>
                                <img src={preview} alt="Preview" className={cx('previewImage')} />
                                <div className={cx('fileInfo')}>
                                    <span className={cx('fileName')}>Ảnh đã chọn</span>
                                    <span className={cx('fileSize')}>Click để chọn ảnh khác</span>
                                </div>
                            </div>
                        ) : (
                            'Chọn ảnh'
                        )}
                    </div>
                </div>
                <button type="submit" className={cx('submitBtn')}>
                    {editingArticle ? 'Cập nhật' : 'Đăng bài'}
                </button>
            </form>

            {/* Danh sách bài viết */}
            <div className={cx('articlesList')}>
                <h2>Danh sách bài viết ({totalArticles} bài)</h2>
                <div className={cx('articlesGrid')}>
                    {articles.map(article => (
                        <div key={article._id} className={cx('articleCard')}>
                            <div className={cx('articleImage')}>
                                <img src={`${API_URL}${article.image}`} alt={article.title} />
                            </div>
                            <div className={cx('articleContent')}>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <div className={cx('articleTags')}>
                                    {article.tags?.map((tag, index) => (
                                        <span key={index} className={cx('tag')}>{tag}</span>
                                    ))}
                                </div>
                                <div className={cx('articleActions')}>
                                    <button 
                                        className={cx('editBtn')}
                                        onClick={() => handleEdit(article)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button 
                                        className={cx('deleteBtn')}
                                        onClick={() => handleDelete(article._id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Phân trang */}
                <div className={cx('pagination')}>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
    );
}
