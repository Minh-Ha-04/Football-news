import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useState,useEffect } from 'react';
import styles from './Posts.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';



const cx = classNames.bind(styles);
export default function Posts() {
    const { register, handleSubmit, setValue } = useForm();
    const [preview, setPreview] = useState(null);
    //xem anh
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
    const onSubmit = async (data) => {
        try {
            // Convert image 
            const imageFile = data.image;
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = async () => {
                const picture_post = reader.result;
                
                // Prepare data to send
                const formData = {
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    image: picture_post
                };
                
                // Send data to API
                const response = await fetch('http://localhost:5000/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                
                if (response.ok) {
                    alert('Bài viết đã được đăng thành công!');
                    // Reset form
                    setValue('title', '');
                    setValue('description', '');
                    setValue('content', '');
                    setPreview(null);
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message}`);
                }
            };
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra khi đăng bài viết');
        }
    };



    return (
        

        <div className={cx('posts')}>
            <h2>Thêm bài viết</h2>
            <form className={cx('wrapper')} onSubmit={handleSubmit(onSubmit)}>
                <input {...register('title')} placeholder="Tiêu đề bài viết" className={cx('title')} />
                <input {...register('description')} placeholder="Mô tả" className={cx('description')} />
                <input {...register('content')} placeholder="Nội dung bài viết" className={cx('content')} />
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
                <Button large type="submit">
                    Đăng bài
                </Button>
            </form>
            
        </div>
    );
}
