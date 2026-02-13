import type { landType } from "../../common/types/land.type";
import type { userType } from "../../common/types/user.type";
import Deal from "../deal/deal";
import DealList from "../deal/dealList";
import Rank from "../rank/rank";

type UserProps = {
  profile: userType | null,
  land: landType | null,
  setLand: React.Dispatch<React.SetStateAction<landType | null>>
}

const User = ({ profile, land, setLand }: UserProps) => {
  return (
    <div className="absolute top-12 left-12 h-[90%] w-[25%] bg-white/80 flex flex-col items-start p-5 shadow-2xl pointer-events-auto space-y-5 rounded-xl">
      <Rank />
      <Deal profile={profile} land={land} setLand={setLand} />
      <DealList />
    </div>
  );
}

export default User;