import { useForm } from "react-hook-form";
import Button from "~/components/Button";
import Data from "~/Data";
const teams = Data.map(team=>team.name)

export default function MatchScoreForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Tỷ số trận đấu:", data);
    alert("Tỷ số trận đấu đã được đăng tải thành công!");
    reset();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Đăng Tỷ Số Trận Đấu</h2>
        <div >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <select {...register("teamA", { required: true })}>
              <option value="">Chọn đội A</option>
              {teams.map((teams) => (
                <option key={teams} value={teams}>{teams}</option>
              ))}
            </select>
            <input type="number" placeholder="Bàn thắng đội A" {...register("scoreA", { required: true })} />
            <select {...register("teamB", { required: true })}>
              <option value="">Chọn đội B</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <input type="number" placeholder="Bàn thắng đội B" {...register("scoreB", { required: true })} />
            <input type="date" {...register("matchDate", { required: true })} />
            <input type="time" {...register("matchTime", { required: true })} />
            <Button type="submit" className="w-full">Đăng Tỷ Số</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
