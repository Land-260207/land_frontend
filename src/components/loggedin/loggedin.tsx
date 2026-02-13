import { useState } from "react";
import { type landType } from "../../common/types/land.type";
import Search from "../search/search";
import Land from "../land/land";
import Rank from "../rank/rank";
import Deal from "../deal/deal";

const LoggedIn = () => {
  const [currentLand, setCurrentLand] = useState<landType | null>(null);

  return (
    <div className="flex flex-col items-center w-full h-full gap-6 p-6">
      <Rank />
      <Search setCurrentLand={setCurrentLand} />
      <Deal currentLand={currentLand} />
      <Land />
    </div>
  );
};

export default LoggedIn;