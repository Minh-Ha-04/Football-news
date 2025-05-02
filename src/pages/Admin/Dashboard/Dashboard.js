import { faEdit, faSave, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Dashboard.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
// Thêm API_URL nếu chưa có
const API_URL = process.env.REACT_APP_API_URL 
const cx=classNames.bind(styles);
const Dashboard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [newTeam, setNewTeam] = useState({
        name: '',
        shortName: '',
        logo: '',
        stadium: ''
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/team`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setTeams(response.data.data);
            } else {
                setError(response.data.message || 'Không thể tải danh sách đội bóng');
            }
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đội bóng:', error);
            setError(error.response?.data?.message || 'Không thể tải danh sách đội bóng');
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            // Cập nhật thống kê cho từng đội
            for (const team of teams) {
                await axios.put(
                    `${API_URL}/team/${team._id}/stats`,
                    {
                        matchesPlayed: team.seasonStats.matchesPlayed,
                        wins: team.seasonStats.wins,
                        draws: team.seasonStats.draws,
                        losses: team.seasonStats.losses,
                        goalsScored: team.seasonStats.goalsScored,
                        goalsConceded: team.seasonStats.goalsConceded
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
            setIsEditing(false);
            alert('Đã cập nhật thống kê thành công');
        } catch (error) {
            console.error('Lỗi khi cập nhật thống kê:', error);
            alert('Có lỗi xảy ra khi cập nhật thống kê');
        }
    };

    const handleTeamUpdate = (teamId, field, value) => {
        setTeams(prevTeams => {
            const updatedTeams = prevTeams.map(team => {
                if (team._id === teamId) {
                    const updatedTeam = {
                        ...team,
                        seasonStats: {
                            ...team.seasonStats,
                            [field]: parseInt(value) || 0
                        }
                    };
                    // Tự động tính điểm
                    updatedTeam.seasonStats.points = 
                        (updatedTeam.seasonStats.wins * 3) + 
                        (updatedTeam.seasonStats.draws * 1);
                    // Tự động tính hiệu số
                    updatedTeam.seasonStats.goalDifference = 
                        (updatedTeam.seasonStats.goalsScored || 0) - 
                        (updatedTeam.seasonStats.goalsConceded || 0);
                    return updatedTeam;
                }
                return team;
            });
            // Sắp xếp lại theo điểm số
            return updatedTeams.sort((a, b) => b.seasonStats.points - a.seasonStats.points);
        });
    };

    const handleAddTeam = () => {
        setShowAddModal(true);
    };

    const handleEditTeam = (team) => {
        setSelectedTeam(team);
        setShowEditModal(true);
    };

    const handleDeleteTeam = async (teamId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đội bóng này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/team/${teamId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                await fetchTeams();
                alert('Đã xóa đội bóng thành công');
            } catch (error) {
                console.error('Lỗi khi xóa đội bóng:', error);
                alert('Có lỗi xảy ra khi xóa đội bóng');
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            
            formDataToSend.append('name', newTeam.name);
            formDataToSend.append('shortName', newTeam.shortName);
            formDataToSend.append('stadium', newTeam.stadium);
            formDataToSend.append('type', 'team');
            
            if (newTeam.logo instanceof File) {
                formDataToSend.append('logo', newTeam.logo);
            }
            
            const response = await axios.post(`${API_URL}/team`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                setShowAddModal(false);
                setNewTeam({
                    name: '',
                    shortName: '',
                    logo: null,
                    stadium: ''
                });
                await fetchTeams();
                alert('Đã thêm đội bóng thành công');
            } else {
                alert(response.data.message || 'Có lỗi xảy ra khi thêm đội bóng');
            }
        } catch (error) {
            console.error('Lỗi khi thêm đội bóng:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm đội bóng');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            
            formDataToSend.append('name', selectedTeam.name);
            formDataToSend.append('shortName', selectedTeam.shortName);
            formDataToSend.append('stadium', selectedTeam.stadium);
            formDataToSend.append('type', 'team');
            
            if (selectedTeam.logo instanceof File) {
                formDataToSend.append('logo', selectedTeam.logo);
            }
            
            const response = await axios.put(`${API_URL}/team/${selectedTeam._id}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                setShowEditModal(false);
                setSelectedTeam(null);
                await fetchTeams();
                alert('Đã cập nhật đội bóng thành công');
            } else {
                alert(response.data.message || 'Có lỗi xảy ra khi cập nhật đội bóng');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật đội bóng:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đội bóng');
        }
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

        return (
            <div className={cx('dashboard')}>
                <div className={cx('header')}>
                    <h2 className={cx('title')}>Quản lý bảng đội bóng</h2>
                    <div className={cx('actions')}>
                        <button className={cx('addButton')} onClick={handleAddTeam}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm đội bóng
                        </button>
                        {!isEditing ? (
                            <button className={cx('editButton')} onClick={handleEdit}>
                                <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                            </button>
                        ) : (
                            <button className={cx('saveButton')} onClick={handleSave}>
                                <FontAwesomeIcon icon={faSave} /> Lưu thay đổi
                            </button>
                        )}
                    </div>
                </div>

                <div className={cx('tableContainer')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Vị trí</th>
                                <th>Đội</th>
                                <th>Trận</th>
                                <th>Thắng</th>
                                <th>Hòa</th>
                                <th>Thua</th>
                                <th>Bàn thắng</th>
                                <th>Bàn thua</th>
                                <th>Hiệu số</th>
                                <th>Điểm</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, index) => (
                                <tr key={team._id}>
                                    <td>{index + 1}</td>
                                    <td className={cx('teamName')}>
                                        <img src={`${API_URL}${team.logo}`} alt={team.name} className={cx('teamLogo')} />
                                        {team.name}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.matchesPlayed}
                                                onChange={(e) => handleTeamUpdate(team._id, 'matchesPlayed', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.matchesPlayed
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.wins}
                                                onChange={(e) => handleTeamUpdate(team._id, 'wins', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.wins
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.draws}
                                                onChange={(e) => handleTeamUpdate(team._id, 'draws', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.draws
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.losses}
                                                onChange={(e) => handleTeamUpdate(team._id, 'losses', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.losses
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.goalsScored || 0}
                                                onChange={(e) => handleTeamUpdate(team._id, 'goalsScored', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.goalsScored || 0
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={team.seasonStats.goalsConceded || 0}
                                                onChange={(e) => handleTeamUpdate(team._id, 'goalsConceded', e.target.value)}
                                                className={cx('input')}
                                            />
                                        ) : (
                                            team.seasonStats.goalsConceded || 0
                                        )}
                                    </td>
                                    <td>{team.seasonStats.goalDifference || 0}</td>
                                    <td>{team.seasonStats.points}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button 
                                                className={cx('editBtn')}
                                                onClick={() => handleEditTeam(team)}
                                                title="Chỉnh sửa"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button 
                                                className={cx('deleteBtn')}
                                                onClick={() => handleDeleteTeam(team._id)}
                                                title="Xóa"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal thêm đội bóng */}
                {showAddModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Thêm đội bóng mới</h2>
                            <form onSubmit={handleAddSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Tên đội bóng:</label>
                                    <input
                                        type="text"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value.trim()})}
                                        required
                                        minLength={2}
                                        maxLength={50}
                                        placeholder="Nhập tên đội bóng"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tên viết tắt:</label>
                                    <input
                                        type="text"
                                        value={newTeam.shortName}
                                        onChange={(e) => setNewTeam({...newTeam, shortName: e.target.value.trim()})}
                                        required
                                        minLength={2}
                                        maxLength={10}
                                        placeholder="VD: MU, ARS, CHE"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Logo:</label>
                                    <div className={styles.imagePreview}>
                                        {newTeam.logo && (
                                           <img 
                                           src={newTeam.logo instanceof File 
                                               ? URL.createObjectURL(newTeam.logo)  // Nếu là tệp ảnh, tạo URL tạm thời
                                               : `${API_URL}${newTeam.logo}`}        // Nếu là đường dẫn URL từ server
                                           alt="Preview"
                                           className={styles.previewImage}
                                       />                                       
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setNewTeam(prev => ({
                                                    ...prev,
                                                    logo: file
                                                }));
                                            }
                                        }}
                                        className={styles.fileInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sân vận động:</label>
                                    <input
                                        type="text"
                                        value={newTeam.stadium}
                                        onChange={(e) => setNewTeam({...newTeam, stadium: e.target.value.trim()})}
                                        required
                                        placeholder="Nhập tên sân vận động"
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="submit" className={styles.submitButton}>
                                        <FontAwesomeIcon icon={faSave} /> Lưu
                                    </button>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewTeam({
                                                name: '',
                                                shortName: '',
                                                logo: null,
                                                stadium: ''
                                            });
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal chỉnh sửa đội bóng */}
                {showEditModal && selectedTeam && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Chỉnh sửa đội bóng</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Tên đội bóng:</label>
                                    <input
                                        type="text"
                                        value={selectedTeam.name}
                                        onChange={(e) => setSelectedTeam({...selectedTeam, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tên viết tắt:</label>
                                    <input
                                        type="text"
                                        value={selectedTeam.shortName}
                                        onChange={(e) => setSelectedTeam({...selectedTeam, shortName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Logo:</label>
                                    <div className={styles.imagePreview}>
                                        {selectedTeam?.logo && (
                                            <img 
                                                src={`${API_URL}${selectedTeam.logo}`}
                                                alt="Preview"
                                                className={styles.previewImage}
                                            />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSelectedTeam(prev => ({
                                                    ...prev,
                                                    logo: file
                                                }));
                                            }
                                        }}
                                        className={styles.fileInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sân vận động:</label>
                                    <input
                                        type="text"
                                        value={selectedTeam.stadium}
                                        onChange={(e) => setSelectedTeam({...selectedTeam, stadium: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="submit" className={styles.submitButton}>
                                        <FontAwesomeIcon icon={faSave} /> Lưu
                                    </button>
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton}
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default Dashboard;
