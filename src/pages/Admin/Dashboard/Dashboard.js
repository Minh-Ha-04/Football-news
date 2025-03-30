import { faTrophy, faCalendarAlt, faClock, faUsers, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Dashboard.module.scss';
import { useState } from 'react';
import teamsData from '~/Data';

const Dashboard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tableData, setTableData] = useState({
        teams: teamsData.map((team) => ({
            id: team.position,
            name: team.name,
            played: team.matches,
            won: team.wins,
            drawn: team.draws,
            lost: team.losses,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            points: team.points,
            image: team.image,
        })),
        lastUpdate: '2 giờ trước',
        nextUpdate: '3 ngày nữa',
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Ở đây có thể thêm logic để lưu vào database
    };

    const calculatePoints = (won, drawn) => {
        return won * 3 + drawn;
    };

    const handleTeamUpdate = (teamId, field, value) => {
        setTableData((prev) => {
            const updatedTeams = prev.teams.map((team) => {
                if (team.id === teamId) {
                    const updatedTeam = { ...team, [field]: parseInt(value) };

                    // Tự động tính điểm khi thay đổi số trận thắng hoặc hòa
                    if (field === 'won' || field === 'drawn') {
                        updatedTeam.points = calculatePoints(updatedTeam.won, updatedTeam.drawn);
                    }

                    return updatedTeam;
                }
                return team;
            });

            // Sắp xếp lại theo điểm số (giảm dần)
            updatedTeams.sort((a, b) => {
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                // Nếu điểm bằng nhau, sắp xếp theo hiệu số bàn thắng
                return b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst);
            });

            return {
                ...prev,
                teams: updatedTeams,
            };
        });
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h2 className={styles.title}>Quản lý bảng xếp hạng Premier League</h2>
                <div className={styles.actions}>
                    {!isEditing ? (
                        <button className={styles.editButton} onClick={handleEdit}>
                            <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                        </button>
                    ) : (
                        <button className={styles.saveButton} onClick={handleSave}>
                            <FontAwesomeIcon icon={faSave} /> Lưu thay đổi
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
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
                            <th>Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.teams.map((team, index) => (
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td className={styles.teamName}>
                                    <img src={team.image} alt={team.name} className={styles.teamLogo} />
                                    {team.name}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.played}
                                            onChange={(e) => handleTeamUpdate(team.id, 'played', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.played
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.won}
                                            onChange={(e) => handleTeamUpdate(team.id, 'won', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.won
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.drawn}
                                            onChange={(e) => handleTeamUpdate(team.id, 'drawn', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.drawn
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.lost}
                                            onChange={(e) => handleTeamUpdate(team.id, 'lost', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.lost
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.goalsFor}
                                            onChange={(e) => handleTeamUpdate(team.id, 'goalsFor', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.goalsFor
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.goalsAgainst}
                                            onChange={(e) => handleTeamUpdate(team.id, 'goalsAgainst', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.goalsAgainst
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={team.points}
                                            onChange={(e) => handleTeamUpdate(team.id, 'points', e.target.value)}
                                            className={styles.input}
                                        />
                                    ) : (
                                        team.points
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.updateInfo}>
                <div className={styles.infoItem}>
                    <FontAwesomeIcon icon={faClock} className={styles.icon} />
                    <span>Cập nhật lần cuối: {tableData.lastUpdate}</span>
                </div>
                <div className={styles.infoItem}>
                    <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                    <span>Cập nhật tiếp theo: {tableData.nextUpdate}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
