import { useEffect } from "react";
import type { landType } from "../../common/types/land.type";
import type { userType } from "../../common/types/user.type";
import Deal from "../deal/deal";
import DealList from "../deal/dealList";
import Rank from "../rank/rank";
import { dealSocket } from "../../common/socket";

type UserProps = {
  landSocket: any,
  profile: userType | null,
  land: landType | null,
  setLand: React.Dispatch<React.SetStateAction<landType | null>>
};

const User = ({ landSocket, profile, land, setLand }: UserProps) => {
  useEffect(() => {
    dealSocket.connect();

    dealSocket.on('error_custom', (error) => {
      console.error(error);
      console.log('Deal Socket: ', error.message);
    });

    return () => {
      dealSocket.close();
    };
  }, []);

  return (
    <div className="absolute top-12 left-12 h-[90%] w-[20%] rounded-xl flex flex-col items-start pointer-events-none space-y-5">
      <Rank />
      <Deal dealSocket={dealSocket} landSocket={landSocket} profile={profile} land={land} setLand={setLand} />
      <DealList dealSocket={dealSocket} landSocket={landSocket} />
    </div>
  );
}

export default User;