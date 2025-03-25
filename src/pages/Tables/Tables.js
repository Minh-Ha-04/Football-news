import styles from './Tables.module.scss'
import classNames from 'classnames/bind';
import Data from '~/Data'
const cx= classNames.bind(styles)
const data=Data;
function Tables() {
    return (
        <div className={cx('wrapper')}>
          <h2 className={cx('bxh')}>Bảng Xếp Hạng</h2>
          <table className={cx('tables')}>
            <thead>
              <tr className={cx('header')}>
                <th className={cx('header-item')}>TT</th>
                <th className={cx('header-item')}>Đội</th>
                <th className={cx('header-item')}>Trận</th>
                <th className={cx('header-item')}>Thắng</th>
                <th className={cx('header-item')}>Hòa</th>
                <th className={cx('header-item')}>Thua</th>
                <th className={cx('header-item')}>Bàn thắng</th>
                <th className={cx('header-item')}>Bàn thua</th>
                <th className={cx('header-item')}>Hiệu số</th>
                <th className={cx('header-item')}>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {data.sort((a, b) => b.points - a.points).map((team, index) => (
                <tr key={index} className="content">
                  <td className="tt">{index + 1}</td>
                  <td className="ten">
                    <img src={team.image} alt={team.name} className="logo" />{team.name}
                  </td>
                  <td className="content-item">{team.matches}</td>
                  <td className="content-item">{team.wins}</td>
                  <td className="content-item">{team.draws}</td>
                  <td className="content-item">{team.losses}</td>
                  <td className="content-item">{team.goalsFor}</td>
                  <td className="content-item">{team.goalsAgainst}</td>
                  <td className="content-item">{team.goalDifference}</td>
                  <td className="content-item">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default Tables;
