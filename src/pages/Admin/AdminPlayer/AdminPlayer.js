import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faEdit, 
    faTrash, 
    faUpload,
    faUser,
    faShirt,
    faFutbol,
    faRulerVertical,
    faWeightScale,
    faUsers,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './AdminPlayer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

// Thêm API_URL nếu ch

function AdminPlayer() {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: '',
        height: '',
        weight: '',
        team: '',
        image: '',
        imageFile: null
    });

    useEffect(() => {
        fetchPlayers();
        fetchTeams();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/player');
            setPlayers(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách cầu thủ:', error);
            alert('Lỗi khi tải danh sách cầu thủ');
        }
    };

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
    

    const handleAdd = () => {
        setEditingPlayer(null);
        setFormData({
            name: '',
            number: '',
            position: '',
            height: '',
            weight: '',
            team: '',
            image: '',
            imageFile: null
        });
        setIsModalVisible(true);
    };

    const handleEdit = (player) => {
        setEditingPlayer(player);
        setFormData({
            name: player.name,
            number: player.number,
            position: player.position,
            height: player.height,
            weight: player.weight,
            team: player.team,
            image: player.image,
            imageFile: null
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
            try {
                await axios.delete(`http://localhost:5000/player/${id}`);
                alert('Xóa cầu thủ thành công');
                fetchPlayers();
            } catch (error) {
                console.error('Lỗi khi xóa cầu thủ:', error);
                alert('Lỗi khi xóa cầu thủ');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo URL để xem trước ảnh
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                image: imageUrl,
                imageFile: file // Lưu file để chuyển đổi sau
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tạo object dữ liệu để gửi
            const dataToSend = {
                name: formData.name,
                number: formData.number,
                position: formData.position,
                height: formData.height,
                weight: formData.weight,
                team: formData.team
            };

            // Nếu có file ảnh mới, chuyển thành base64
            if (formData.imageFile) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    dataToSend.image = reader.result; // base64 string
                    
                    if (editingPlayer) {
                        await axios.put(`http://localhost:5000/player/${editingPlayer._id}`, dataToSend, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        alert('Cập nhật cầu thủ thành công');
                    } else {
                        await axios.post('http://localhost:5000/player', dataToSend, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        alert('Thêm cầu thủ thành công');
                    }
                    setIsModalVisible(false);
                    fetchPlayers();
                };
                reader.readAsDataURL(formData.imageFile);
            } else {
                // Nếu không có ảnh mới, gửi ngay
                if (editingPlayer) {
                    await axios.put(`http://localhost:5000/player/${editingPlayer._id}`, dataToSend, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    alert('Cập nhật cầu thủ thành công');
                } else {
                    await axios.post('http://localhost:5000/player', dataToSend, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    alert('Thêm cầu thủ thành công');
                }
                setIsModalVisible(false);
                fetchPlayers();
            }
        } catch (error) {
            console.error('Lỗi khi lưu cầu thủ:', error);
            alert('Lỗi khi lưu cầu thủ: ' + (error.response?.data?.message || error.message));
        }
    };
    

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Quản lý cầu thủ</h2>
                <button className={cx('addButton')} onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm cầu thủ
                </button>
            </div>

            <div className={cx('tableContainer')}>
                <table className={cx('playerTable')}>
                    <thead>
                        <tr>
                            <th><FontAwesomeIcon icon={faUser} /> Tên cầu thủ</th>
                            <th><FontAwesomeIcon icon={faShirt} /> Số áo</th>
                            <th><FontAwesomeIcon icon={faFutbol} /> Vị trí</th>
                            <th><FontAwesomeIcon icon={faRulerVertical} /> Chiều cao</th>
                            <th><FontAwesomeIcon icon={faWeightScale} /> Cân nặng</th>
                            <th><FontAwesomeIcon icon={faUsers} /> Đội bóng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr key={player._id}>
                                <td>{player.name}</td>
                                <td>{player.number}</td>
                                <td>{player.position}</td>
                                <td>{player.height} cm</td>
                                <td>{player.weight} kg</td>
                                <td>{player.team?.name || 'Chưa có đội'}</td>
                                <td>
                                    <div className={cx('actionButtons')}>
                                        <button 
                                            className={cx('editButton')}
                                            onClick={() => handleEdit(player)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            Sửa
                                        </button>
                                        <button 
                                            className={cx('deleteButton')}
                                            onClick={() => handleDelete(player._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalVisible && (
                <div className={cx('modal')}>
                    <div className={cx('modalContent')}>
                        <div className={cx('modalHeader')}>
                            <h3>{editingPlayer ? 'Sửa cầu thủ' : 'Thêm cầu thủ'}</h3>
                            <button className={cx('closeButton')} onClick={() => setIsModalVisible(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className={cx('form')}>
                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faUser} /> Tên cầu thủ
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faShirt} /> Số áo
                                </label>
                                <input
                                    type="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faFutbol} /> Vị trí
                                </label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn vị trí</option>
                                    <option value="Thủ môn">Thủ môn</option>
                                    <option value="Hậu vệ">Hậu vệ</option>
                                    <option value="Tiền vệ">Tiền vệ</option>
                                    <option value="Tiền đạo">Tiền đạo</option>
                                </select>
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faRulerVertical} /> Chiều cao (cm)
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faWeightScale} /> Cân nặng (kg)
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faUsers} /> Đội bóng
                                </label>
                                <select
                                    name="team"
                                    value={formData.team}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn đội bóng</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team._id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={cx('formGroup')}>
                                <label>
                                    <FontAwesomeIcon icon={faUpload} /> Ảnh cầu thủ
                                </label>
                                <div className={cx('uploadContainer')} onClick={handleUploadClick}>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={cx('fileInput')}
                                        style={{ display: 'none' }}
                                    />
                                    <div className={cx('uploadContent')}>
                                        {formData.image ? (
                                            <img 
                                                src={formData.image} 
                                                alt="Preview" 
                                                className={cx('previewImage')}
                                            />
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faUpload} className={cx('uploadIcon')} />
                                                <div className={cx('uploadText')}>Nhấn để tải ảnh</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className={cx('submitButton')}>
                                {editingPlayer ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPlayer;