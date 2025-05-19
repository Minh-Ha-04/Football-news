import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import styles from './MatchScoreForm.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const API_URL = process.env.REACT_APP_API_URL;

export default function MatchScoreForm() {
    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previewHomeTeam, setPreviewHomeTeam] = useState(null);
    const [previewAwayTeam, setPreviewAwayTeam] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const status = watch('status', 'upcoming');

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    const fetchMatches = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/match?page=${page}&limit=10`);
            if (response.data.success) {
                // Nếu là trang đầu thì reset, còn lại thì nối thêm
                setMatches((prev) => (page === 1 ? response.data.data : [...prev, ...response.data.data]));
                setCurrentPage(page);
                setTotalPages(response.data.totalPages); // Đảm bảo API có trả về totalPages
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách trận đấu:', error);
        } finally {
            setLoading(false);
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

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            // Ensure time is in HH:mm format
            const timeParts = data.matchTime.split(':');
            const formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;

            // Lấy thông tin đội bóng từ danh sách teams
            const homeTeam = teams.find((team) => team._id === data.teamA);
            const awayTeam = teams.find((team) => team._id === data.teamB);

            const matchData = {
                homeTeam: data.teamA,
                awayTeam: data.teamB,
                logoHomeTeam: homeTeam?.logo || '',
                logoAwayTeam: awayTeam?.logo || '',
                matchDate: `${data.matchDate}T${formattedTime}:00`,
                stadium: data.stadium,
                status: data.status,
                round: parseInt(data.round) || 1,
                score:
                    data.status === 'completed'
                        ? {
                              home: parseInt(data.homeScore) || 0,
                              away: parseInt(data.awayScore) || 0,
                          }
                        : null,
            };

            if (isEditing && selectedMatch) {
                await axios.put(`${API_URL}/match/${selectedMatch._id}`, matchData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Đã cập nhật trận đấu thành công!');
            } else {
                await axios.post(`${API_URL}/match`, matchData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Đã thêm trận đấu thành công!');
            }

            // Reset form và state
            resetForm();
            fetchMatches();
        } catch (error) {
            console.error('Lỗi khi lưu trận đấu:', error);
            alert('Có lỗi xảy ra khi lưu trận đấu!');
        }
    };

    const resetForm = () => {
        reset({
            teamA: '',
            teamB: '',
            matchDate: '',
            matchTime: '',
            stadium: '',
            status: 'upcoming',
            round: 0,
            homeScore: 0,
            awayScore: 0,
        });
        setIsEditing(false);
        setSelectedMatch(null);
        setPreviewHomeTeam(null);
        setPreviewAwayTeam(null);
    };

    const handleEdit = (match) => {
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setSelectedMatch(match);
        setIsEditing(true);
        const matchDateTime = new Date(match.matchDate);
        const hours = matchDateTime.getHours().toString().padStart(2, '0');
        const minutes = matchDateTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        reset({
            teamA: match.homeTeam._id,
            teamB: match.awayTeam._id,
            logoHomeTeam: match.logoHomeTeam,
            logoAwayTeam: match.logoAwayTeam,
            matchDate: match.matchDate.split('T')[0],
            matchTime: formattedTime,
            stadium: match.stadium,
            status: match.status,
            round: parseInt(match.round) || 1,
            homeScore: match.score?.home || 0,
            awayScore: match.score?.away || 0,
        });

        // Set preview states
        setPreviewHomeTeam({ ...match.homeTeam, logo: match.logoHomeTeam });
        setPreviewAwayTeam({ ...match.awayTeam, logo: match.logoAwayTeam });
    };

    const handleDelete = async (matchId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa trận đấu này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/match/${matchId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Đã xóa trận đấu thành công!');
                fetchMatches();
            } catch (error) {
                console.error('Lỗi khi xóa trận đấu:', error);
                alert('Có lỗi xảy ra khi xóa trận đấu!');
            }
        }
    };

    const handleTeamChange = (e) => {
        const { name, value } = e.target;
        const selectedTeam = teams.find((team) => team._id === value);

        if (name === 'teamA') {
            if (selectedTeam) {
                setValue('stadium', selectedTeam.stadium);
                setPreviewHomeTeam(selectedTeam);
            } else {
                setPreviewHomeTeam(null);
            }
        } else if (name === 'teamB') {
            if (selectedTeam) {
                setPreviewAwayTeam(selectedTeam);
            } else {
                setPreviewAwayTeam(null);
            }
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('form-wrapper')}>
                <h2 className={cx('title')}>{isEditing ? 'Chỉnh Sửa Trận Đấu' : 'Thêm Trận Đấu Mới'}</h2>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
                        <div className={cx('team-selection')}>
                            <div className={cx('team-select-group')}>
                                {previewHomeTeam && (
                                    <div className={cx('team-preview')}>
                                        <img
                                            src={`${API_URL}${previewHomeTeam.logo}`}
                                            alt={previewHomeTeam.name}
                                            className={cx('preview-logo')}
                                        />
                                    </div>
                                )}
                                <select
                                    {...register('teamA', { required: true })}
                                    className={cx('select')}
                                    name="teamA"
                                    onChange={handleTeamChange}
                                >
                                    <option value="">Chọn đội nhà</option>
                                    {teams.map((team) => (
                                        <option key={team._id} value={team._id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(previewHomeTeam || previewAwayTeam) && <span className={cx('vs-text')}>VS</span>}

                            <div className={cx('team-select-group')}>
                                {previewAwayTeam && (
                                    <div className={cx('team-preview')}>
                                        <img
                                            src={`${API_URL}${previewAwayTeam.logo}`}
                                            alt={previewAwayTeam.name}
                                            className={cx('preview-logo')}
                                        />
                                    </div>
                                )}
                                <select
                                    {...register('teamB', { required: true })}
                                    className={cx('select')}
                                    name="teamB"
                                    onChange={handleTeamChange}
                                >
                                    <option value="">Chọn đội khách</option>
                                    {teams.map((team) => (
                                        <option key={team._id} value={team._id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Sân vận động"
                            {...register('stadium', { required: true })}
                            className={cx('input')}
                            readOnly={isEditing}
                        />

                        <input
                            type="number"
                            placeholder="Vòng đấu"
                            {...register('round', { required: true })}
                            className={cx('input')}
                        />

                        <select {...register('status', { required: true })} className={cx('select')}>
                            <option value="upcoming">Sắp diễn ra</option>
                            <option value="completed">Đã kết thúc</option>
                        </select>

                        <input type="date" {...register('matchDate', { required: true })} className={cx('input')} />
                        <input type="time" {...register('matchTime', { required: true })} className={cx('input')} />

                        {status === 'completed' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Tỷ số đội nhà"
                                    {...register('homeScore', { min: 0 })}
                                    className={cx('input')}
                                />
                                <input
                                    type="number"
                                    placeholder="Tỷ số đội khách"
                                    {...register('awayScore', { min: 0 })}
                                    className={cx('input')}
                                />
                            </>
                        )}

                        <Button type="submit" className={cx('submit-btn')}>
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                        {isEditing && (
                            <Button type="button" onClick={resetForm} className={cx('cancel-btn')}>
                                Hủy
                            </Button>
                        )}
                    </form>
                </div>
            </div>

            <div className={cx('matches-list')}>
                <h3>Danh sách trận đấu</h3>
                <table className={cx('matches-table')}>
                    <thead>
                        <tr>
                            <th>Vòng đấu</th>
                            <th>Đội nhà</th>
                            <th>Đội khách</th>
                            <th>Tỷ số</th>
                            <th>Sân vận động</th>
                            <th>Ngày giờ</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match) => (
                            <tr key={match._id}>
                                <td>{match.round}</td>
                                <td>
                                    <div className={cx('team-cell')}>
                                        <img
                                            src={`${API_URL}${match.logoHomeTeam}`}
                                            alt={match.homeTeam.name}
                                            className={cx('team-logo')}
                                        />
                                        <span>{match.homeTeam.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={cx('team-cell')}>
                                        <img
                                            src={`${API_URL}${match.logoAwayTeam}`}
                                            alt={match.awayTeam.name}
                                            className={cx('team-logo')}
                                        />
                                        <span>{match.awayTeam.name}</span>
                                    </div>
                                </td>
                                <td>
                                    {match.status === 'completed'
                                        ? `${match.score?.home || 0} - ${match.score?.away || 0}`
                                        : 'Chưa diễn ra'}
                                </td>
                                <td>{match.stadium}</td>
                                <td>{new Date(match.matchDate).toLocaleString('vi-VN')}</td>
                                <td>{match.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}</td>
                                <td>
                                    <button onClick={() => handleEdit(match)} className={cx('action-btn', 'edit-btn')}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(match._id)}
                                        className={cx('action-btn', 'delete-btn')}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {currentPage < totalPages && (
                    <div className={cx('load-more')}>
                        <button
                            className={cx('button')}
                            onClick={() => fetchMatches(currentPage + 1)}
                            disabled={loading}
                        >
                            {loading ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
