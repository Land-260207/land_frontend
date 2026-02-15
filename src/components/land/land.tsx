import { useEffect, useState } from "react";
import type { landType } from "../../common/types/land.type";
import Search from "../search/search";
import type { userType } from "../../common/types/user.type";

type LandProps = {
  profile: userType | null,
  setLand: React.Dispatch<React.SetStateAction<landType | null>>
}

const Land = ({ profile, setLand }: LandProps) => {
  const [lands, setLands] = useState<landType[]>();

  useEffect(() => {
    setLands(profile?.Lands);
  }, [profile]);

  return (
    <div className="absolute top-12 right-12 h-[90%] w-[20%] bg-white/80 rounded-xl flex flex-col items-start p-5 shadow-2xl pointer-events-auto space-y-5">
      <div className="h-[50%] w-full bg-white p-2 rounded-xl shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-center">
          보유 중인 토지
        </h3>

        {lands && lands.length > 0 ? (
          <ul className="h-[90%] overflow-auto">
            {lands.map((land) => {
              const rate = land.price_change_rate;
              const rateNum = rate != null ? Number(rate) : 0;

              let rateColor = "text-gray-600";
              let rateSign = "";

              if (rateNum > 0) {
                rateColor = "text-red-600 font-semibold";
                rateSign = "+";
              } else if (rateNum < 0) {
                rateColor = "text-blue-600 font-semibold";
                rateSign = "";
              } else {
                rateColor = "text-gray-500";
                rateSign = "";
              }

              return (
                <li
                  key={land.sig_cd}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {land.name}: {Number(land.price).toLocaleString('ko-KR')}원
                    </span>
                    <span className="text-sm text-gray-600">{land.full_name}</span>
                  </div>

                  <span className={`text-sm ${rateColor}`}>
                    {rate != null ? `${rateSign}${rateNum.toFixed(2)}%` : "변화 없음"}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
        <div className="w-full py-6 text-center text-gray-500">
          보유 중인 토지가 없습니다
        </div>
      )}
    </div>

    <Search setLand={setLand} />
  </div>)
}

export default Land;