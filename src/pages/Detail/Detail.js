import styles from './Detail.module.scss';
import classNames from 'classnames/bind';
import Section from '~/layouts/components/Section';
import Button from '~/components/Button';
import Article from '~/components/Article';
import Ads from '~/components/Ads';
import Image from '~/components/Image';
import HotNews from '~/components/HotNews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faShare, faBookmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
const cx = classNames.bind(styles);

function Detail() {
    const [isSaved, setIsSaved] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi feedback ở đây
        console.log('Feedback:', feedback);
        setFeedback('');
        setShowFeedback(false);
    };

    return (
        <div className={cx('news')}>
            <Section />
            <div className={cx('container')}>
                <div className={cx('left')}>
                    <time className={cx('time-post')}>Thứ Bảy, ngày 22/03/2025 03:44 AM (GMT+7)</time>
                    <h1 className={cx('title')}>
                        HLV Amorim từ chối Rashford, MU ra giá 60 triệu bảng cho Aston Villa
                    </h1>

                    <div className={cx('media')}>
                        <Button rounded className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>

                    <strong className={cx('desc')}>
                        Marcus Rashford sẽ không có cơ hội trở lại MU vào mùa hè này, khi HLV Ruben Amorim quyết định
                        không đưa tiền đạo người Anh vào kế hoạch tương lai của đội bóng.
                    </strong>
                    <p className={cx('content')}>
                        Theo tờ Daily Star (Anh), HLV Amorim vẫn giữ nguyên quan điểm về Rashford và sẵn sàng để tiền
                        đạo người Anh ra đi theo dạng chuyển nhượng vĩnh viễn vào mùa hè này. Nguồn tin này cũng cho
                        biết ban lãnh đạo MU đang yêu cầu mức phí 60 triệu bảng từ Aston Villa, mặc dù các thông tin
                        trước đó khẳng định điều khoản mua đứt trị giá 40 triệu bảng đã được thỏa thuận khi Rashford gia
                        nhập đội chủ sân Villa Park theo dạng cho mượn ở kỳ chuyển nhượng tháng 1.
                        <div className="image">
                            <Image>
                                {
                                    'https://cdn.24h.com.vn/upload/1-2025/images/2025-03-23/HLV-Amorim-tu-choi-nhan-lai-Rashford-MU-ra-gia-60-trieu-bang-cho-Aston-Villa-20-1742714061-517-width740height492.jpg'
                                }
                            </Image>
                            <p className={cx('note')}>HLV Amorim không muốn đưa Rashford trở lại MU</p>
                        </div>
                        Rashford đã tìm lại phong độ và niềm đam mê với trái bóng trong màu áo Aston Villa, có 4 pha
                        kiến tạo sau 9 lần ra sân dưới sự dẫn dắt của HLV Unai Emery. Trước khi rời MU, tiền đạo người
                        Anh từng bị HLV Amorim chỉ trích vì thái độ trong tập luyện và kể từ ngày 12/12 năm ngoái, anh
                        không có thêm bất kỳ lần ra sân nào cho đội chủ sân Old Trafford. Tuy nhiên, bất chấp những màn
                        trình diễn ấn tượng của Rashford tại Aston Villa, con đường trở lại Old Trafford dường như đã
                        khép lại với anh. HLV Amorim đang lên kế hoạch chiêu mộ một tiền đạo đẳng cấp vào mùa hè này,
                        trong khi ban lãnh đạo MU hy vọng Rashford tiếp tục thể hiện tốt để giúp họ bán được giá hơn.
                        Trước đó, HLV Amorim đã khẳng định lý do để Rashford ra đi là do cả hai không có chung quan điểm
                        về triết lý chơi bóng và tập luyện. Dù vậy, Rashford chưa bao giờ công khai phản đối phương pháp
                        huấn luyện của chiến lược gia người Bồ Đào Nha. HLV Amorim chia sẻ: "Tôi không thể khiến
                        Rashford hiểu cách chơi bóng và tập luyện theo cách tôi muốn. Đôi khi một cầu thủ có thể chơi
                        rất tốt dưới thời một HLV này, nhưng với một HLV khác thì lại hoàn toàn khác. Tôi chúc Rashford
                        và Unai Emery những điều tốt đẹp nhất, hy vọng họ có thể kết nối tốt với nhau vì cậu ấy là một
                        cầu thủ rất giỏi. Bạn biết đấy, chuyện này không phải lúc nào cũng được nói ra. Nó là điều mà cả
                        HLV và cầu thủ đều cảm nhận được. Đây là điều bình thường trong bóng đá, và đã từng xảy ra với
                        rất nhiều HLV khác. Điều quan trọng là tôi đang ở đây để nói rằng đó là quyết định của tôi,
                        giống như việc tôi quyết định cho Tyrell Malacia và Antony ra đi theo dạng cho mượn, hoặc giữ
                        lại một số cầu thủ dù không có kế hoạch chuyển nhượng nào".
                    </p>
                    <p className={cx('author')}>Tác giả :Tiến Long</p>
                    <div className={cx('media')}>
                        <Button rounded className={cx('media-item', { saved: isSaved })} onClick={handleSave}>
                            <FontAwesomeIcon icon={isSaved ? faBookmark : faBookBookmark} />
                            {isSaved ? 'Bỏ lưu' : 'Lưu bài'}
                        </Button>
                        <Button rounded className={cx('media-item')} onClick={() => setShowFeedback(true)}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Gửi góp ý
                        </Button>
                        <Button rounded className={cx('media-item')}>
                            <FontAwesomeIcon icon={faShare} />
                            Chia sẻ
                        </Button>
                    </div>

                    {/* Feedback Modal */}
                    {showFeedback && (
                        <div className={cx('modal-overlay')}>
                            <div className={cx('modal')}>
                                <div className={cx('modal-header')}>
                                    <h3>Gửi góp ý</h3>
                                    <Button className={cx('close-btn')} onClick={() => setShowFeedback(false)}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </Button>
                                </div>
                                <form onSubmit={handleFeedbackSubmit} className={cx('feedback-form')}>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Nhập góp ý của bạn..."
                                        required
                                    />
                                    <Button type="submit" className={cx('submit-btn')}>
                                        Gửi
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className={cx('hotnews')}>
                        <h2 className={cx('header')}>Tin bóng đá mới nhẩt</h2>
                        <HotNews />
                        <HotNews />
                        <div className={cx('button')}>
                            <Button rounded>Xem thêm</Button>
                        </div>
                    </div>
                </div>
                <div className={cx('right')}>
                    <Ads />
                    <div className={cx('more')}>
                        <Button text>Tin Tức</Button>
                        <Article small></Article>
                        <Article small></Article>
                        <Article small></Article>
                        <Article small></Article>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;
