import { useForm } from "react-hook-form";
import Button from "~/components/Button";
import Data from "~/Data";
import styles from './MatchScoreForm.module.scss'
import classNames from 'classnames/bind';

const cx= classNames.bind(styles)
const teams = Data.map(team=>team.name)

export default function MatchScoreForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Tỷ số trận đấu:", data);
    alert("Tỷ số trận đấu đã được đăng tải thành công!");
    reset();
  };

  return (
    <div className={cx('container')}>
      <div className={cx('form-wrapper')}>
        <h2 className={cx('title')}>Đăng Tỷ Số Trận Đấu</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
            <select {...register("teamA", { required: true })} className={cx('select')}>
              <option value="">Chọn đội A</option>
              {teams.map((teams) => (
                <option key={teams} value={teams}>{teams}</option>
              ))}
            </select>
            <input type="number" placeholder="Bàn thắng đội A" {...register("scoreA", { required: true })} className={cx('input')} />
            <select {...register("teamB", { required: true })} className={cx('select')}>
              <option value="">Chọn đội B</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <input type="number" placeholder="Bàn thắng đội B" {...register("scoreB", { required: true })} className={cx('input')} />
            <input type="date" {...register("matchDate", { required: true })} className={cx('input')} />
            <input type="time" {...register("matchTime", { required: true })} className={cx('input')} />
            <Button type="submit" className={cx('submit-btn')}>Đăng Tỷ Số</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
