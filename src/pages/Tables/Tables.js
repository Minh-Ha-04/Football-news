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
                <th className={cx('header-item', 'match-column')}>Trận</th>
                <th className={cx('header-item')}>Thắng</th>
                <th className={cx('header-item')}>Hòa</th>
                <th className={cx('header-item')}>Thua</th>
                <th className={cx('header-item')}>Bàn thắng</th>
                <th className={cx('header-item')}>Bàn thua</th>
                <th className={cx('header-item')}>Hiệu số</th>
                <th className={cx('header-item', 'score-column')}>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {data.sort((a, b) => b.points - a.points).map((team, index) => (
                <tr key={index} className={cx('table-row')}>
                  <td className={cx('table-cell')}>{index + 1}</td>
                  <td className={cx('table-cell', 'team-name')}>
                    <img src={team.image} alt={team.name} className={cx('logo')} />
                    <span>{team.name}</span>
                  </td>
                  <td className={cx('table-cell', 'match-column')}>{team.matches}</td>
                  <td className={cx('table-cell')}>{team.wins}</td>
                  <td className={cx('table-cell')}>{team.draws}</td>
                  <td className={cx('table-cell')}>{team.losses}</td>
                  <td className={cx('table-cell')}>{team.goalsFor}</td>
                  <td className={cx('table-cell')}>{team.goalsAgainst}</td>
                  <td className={cx('table-cell')}>{team.goalDifference}</td>
                  <td className={cx('table-cell', 'score-column')}>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default Tables;
