import type { landType } from "../../common/types/land.type";
import Search from "../search/search";
import api from "../../common/api";
import { useEffect } from "react";

type LandProps = {
  lands: landType[],
  landSocket: any,
  userLands: landType[],
  setUserLands: React.Dispatch<React.SetStateAction<landType[]>>,
  setLand: React.Dispatch<React.SetStateAction<landType | null>>
}

const Land = ({ lands, landSocket, userLands, setUserLands, setLand }: LandProps) => {
  const handleSellLand = async (sig_cd: string) => {
    await landSocket.emit('sell', sig_cd);
  };

  useEffect(() => {
    const handleGetUserLands = async () => {
      const res = await api.get('/land/my');

      setUserLands(res.data.data.lands);
    };

    handleGetUserLands();
  }, []);

  return (
    <div className="absolute top-12 right-12 h-[90%] w-[20%] rounded-xl flex flex-col items-start pointer-events-none space-y-5">
      <div className="h-[50%] w-full bg-white/80 p-2 rounded-xl shadow-xl pointer-events-auto">
        <h3 className="flex justify-center gap-5 mb-4 text-lg font-semibold text-center">
          <p>보유 중인 토지</p>
        </h3>

        {userLands.length > 0 ? (
          <ul className="h-[90%] overflow-auto">
            {userLands.map((land) => {
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

                  <div className="flex flex-col items-center">
                    <span className={`text-sm ${rateColor}`}>
                      {rate != null ? `${rateSign}${rateNum.toFixed(2)}%` : "변화 없음"}
                    </span>
                    <span className="text-sm text-gray-600">
                      <button onClick={() => handleSellLand(land.sig_cd)}>
                        매도
                      </button>
                    </span>
                  </div>
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

    <Search lands={lands} setLand={setLand} />
  </div>)
}

export default Land;