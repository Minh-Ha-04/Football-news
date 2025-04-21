import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import styles from './Posts.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export default function Posts() {
    const { register, handleSubmit, setValue } = useForm();
    const [preview, setPreview] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [articles, setArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);

    // Lấy danh sách đội bóng
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/team');
                if (response.data.success) {
                    setTeams(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đội bóng:', error);
            }
        };
        fetchTeams();
    }, []);

    // Lấy danh sách bài viết
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/articles', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Articles response:', response.data);
                setArticles(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bài viết:', error);
                alert('Không thể tải danh sách bài viết');
            }
        };
        fetchArticles();
    }, []);

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
            // Chuyển đổi tags thành chữ thường để so sánh
            const lowercaseTags = article.tags.map(tag => tag.toLowerCase());
            setSelectedTags(lowercaseTags);
        } else {
            setSelectedTags([]);
        }
        
        if (article.image) {
            setPreview(article.image);
        }
    };

    // Xử lý xóa bài viết
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const response = await axios.delete(`http://localhost:5000/articles/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data) {
                    setArticles(articles.filter(article => article._id !== id));
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
            // Convert image 
            const imageFile = data.image;
            let picture_post = null;
            
            if (imageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                picture_post = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                });
            }
            
            // Prepare data to send
            const formData = {
                title: data.title,
                description: data.description,
                content: data.content,
                image: picture_post,
                tags: selectedTags.map(tag => tag.toLowerCase())
            };

            let response;
            if (editingArticle) {
                // Update existing article
                response = await axios.put(`http://localhost:5000/articles/${editingArticle._id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Create new article
                response = await axios.post('http://localhost:5000/articles', formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
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
                const articlesResponse = await axios.get('http://localhost:5000/articles', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setArticles(articlesResponse.data);
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
                                <img src={team.logo} alt={team.name} className={cx('teamLogo')} />
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
                <h2>Danh sách bài viết</h2>
                <div className={cx('articlesGrid')}>
                    {articles.map(article => (
                        <div key={article._id} className={cx('articleCard')}>
                            <div className={cx('articleImage')}>
                                <img src={article.image} alt={article.title} />
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
            </div>
        </div>
    );
}
