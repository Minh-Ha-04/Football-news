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

// Thêm API_URL nếu chưa có
const API_URL = process.env.REACT_APP_API_URL ;

function AdminPlayer() {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
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
            const response = await axios.get(`${API_URL}/player`);
            setPlayers(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách cầu thủ:', error);
            alert('Lỗi khi tải danh sách cầu thủ');
        }
    };

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
    
    // Lọc cầu thủ theo đội bóng
    const filteredPlayers = selectedTeam
        ? players.filter(player => player.team?._id === selectedTeam)
        : players;

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
            image: player.image ? `${API_URL}${player.image}` : '',
            imageFile: null
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cầu thủ này?')) {
            try {
                await axios.delete(`${API_URL}/player/${id}`);
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
                imageFile: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('type', 'player');
            formDataToSend.append('name', formData.name);
            formDataToSend.append('number', formData.number);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('height', formData.height);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('team', formData.team);
            
            if (formData.imageFile) {
                formDataToSend.append('image', formData.imageFile);
            }

            let response;
            if (editingPlayer) {
                response = await axios.put(`${API_URL}/player/${editingPlayer._id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Cập nhật cầu thủ thành công!');
            } else {
                response = await axios.post(`${API_URL}/player`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Thêm cầu thủ thành công!');
            }

            // Fetch lại danh sách cầu thủ để có đầy đủ thông tin đội bóng
            await fetchPlayers();

            setIsModalVisible(false);
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
            setEditingPlayer(null);
        } catch (error) {
            console.error('Error saving player:', error);
            alert('Có lỗi xảy ra khi lưu cầu thủ');
        }
    };
    

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Quản lý cầu thủ</h2>
                <div className={cx('controls')}>
                    <select 
                        className={cx('team-select')}
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <option value="">Tất cả đội bóng</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                    <button className={cx('addButton')} onClick={handleAdd}>
                        <FontAwesomeIcon icon={faPlus} />
                        Thêm cầu thủ
                    </button>
                </div>
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
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map(player => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    {selectedTeam ? 'Không có cầu thủ nào trong đội bóng này' : 'Không có cầu thủ nào'}
                                </td>
                            </tr>
                        )}
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