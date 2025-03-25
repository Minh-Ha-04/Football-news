import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useDropzone } from 'react-dropzone';
import 'react-quill/dist/quill.snow.css';
import styles from './Posts.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
export default function Posts() {
    const { register, handleSubmit, setValue } = useForm();
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => setValue('image', files[0]),
    });
    const onSubmit = (data) => {
        console.log(data);
        alert('Bài đã được đăng tải thành công!');
    };
    return (
        <div className={cx('posts')}>
            <h2>Thêm bài viết</h2>
            <form className={cx('wrapper')} onSubmit={handleSubmit(onSubmit)}>
                <input {...register('title')} placeholder="Tiêu đề bài viết" className={cx('title')} />
                <input {...register('desc')} placeholder="Mô tả" className={cx('desc')} />
                <ReactQuill onChange={(value) => setValue('content', value)} className={cx('content')} />
                <div  {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className={cx('picture')}>Chọn ảnh</div>
                </div>
                <Button large type="submit">
                    Đăng bài
                </Button>
            </form>
        </div>
    );
}
