import { useEffect, useState } from "react";
import type { landType } from "../../common/types/land.type";
import type { userType } from "../../common/types/user.type";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useNavigate } from "react-router-dom";

type DealProps = {
  dealSocket: any,
  landSocket: any,
  profile: userType | null,
  land: landType | null,
  setLand: React.Dispatch<React.SetStateAction<landType | null>>
}

const Deal = ({ dealSocket, landSocket, profile, land, setLand }: DealProps) => {
  const navigate = useNavigate();
  const [landPrice, setLandPrice] = useState('');
  const EventSource = EventSourcePolyfill || NativeEventSource;

  const handleLogout = () => {
    localStorage.clear();
    alert('로그아웃');
    navigate('/login');
  };

  const handleBuy = async (sig_cd: string) => {
    setLand(null);
    await landSocket.emit('buy', sig_cd);
  };

  const handleRequest = async (sig_cd: string) => {
    setLand(null);
    await dealSocket.emit('request', sig_cd);
  };

  useEffect(() => {
    if (!land) return;

    setLandPrice(land.price.toString());

    const landPriceEventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/land/detail/${land.sig_cd}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });

    landPriceEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLandPrice(data.price);
    };

    landPriceEventSource.onerror = (error) => {
      console.error(error);
      landPriceEventSource.close();
    };

    return () => {
      landPriceEventSource.close();
    };
  }, [land]);
  
  return (
    <div className="font-semibold h-[33%] w-full bg-white/80 p-5 shadow-xl rounded-xl pointer-events-auto">
      <span className="flex justify-between font-normal">
        <p>{profile?.username}</p>
        <button onClick={handleLogout}>로그아웃</button>
      </span>

      <div className="h-full mt-3 space-y-1">
        <p>잔고: {Number(profile?.balance).toLocaleString('ko-KR')}원</p>
        <p>{land ? `${land.name}: ${Number(landPrice).toLocaleString('ko-KR')}원` : '오른쪽에서 토지를 선택해주세요.'}</p>

        {land && (
          <div className="flex flex-col h-full space-y-1">
            <p className="text-gray-600">소유자: {land.Owner ? land.Owner.username : '없음'}</p>
            <p>남는 돈: {(Number(profile?.balance) - Number(landPrice)).toLocaleString('ko-KR')}원</p>

            <div className="pt-2">
              <button
                onClick={land.owner_id ? (() => handleRequest(land.sig_cd)) : (() => handleBuy(land.sig_cd))}
                disabled={land.owner_id === profile?.id && Number(landPrice) > Number(profile?.balance)}
                className={`
                  w-full h-14 rounded-xl shadow-lg text-xl font-semibold text-white transition-colors
                  ${
                    land.owner_id === profile?.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : Number(landPrice) > Number(profile?.balance)
                      ? 'bg-red-400/80 hover:bg-red-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  }
                `}
              >
                {land.owner_id === profile?.id
                  ? '본인 소유 토지입니다'
                  : Number(landPrice) > Number(profile?.balance)
                  ? '잔고 부족으로 구매 불가'
                  : land.owner_id
                  ? '거래 요청하기'
                  : '매수하기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Deal;