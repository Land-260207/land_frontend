import { useEffect, useState } from "react";
import type { dealType } from "../../common/types/deal.type";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import api from "../../common/api";

const DealList = () => {
  const [deals, setDeals] = useState<dealType[]>([]);
  const EventSource = EventSourcePolyfill || NativeEventSource;

  const handleAcceptDeal = async (deal_id: number) => {
    await api.post(`/deal/accept/${deal_id}`);
  };

  const handleRejectDeal = async (deal_id: number) => {
    await api.post(`/deal/reject/${deal_id}`);
  };
  
  useEffect(() => {
    const dealsEventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/deal/list`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });

    dealsEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDeals(data.deals);
    };

    dealsEventSource.onerror = (error) => {
      console.error(error);
      dealsEventSource.close();
    };

    return () => {
      dealsEventSource.close();
    };
  }, []);

  return (
    <div className="font-semibold h-[33%] w-full bg-white/80 shadow-xl rounded-xl">
      <p className="m-5 text-center">거래 요청 목록</p>
      <ul className="w-full h-full">
        {deals.map((deal) => {
          return (
            <li key={deal.id} className="w-full h-[40%] text-sm rounded-xl pl-5 pr-5 font-semibold">
              {deal.Owner?.username === localStorage.getItem('username') ? (
                <div>
                  <div className="flex justify-between">
                    <p>요청자: {deal.Buyer?.username}</p>
                    <div className="flex gap-5">
                      <button onClick={() => handleAcceptDeal(deal.id)}>수락</button>
                      <button onClick={() => handleRejectDeal(deal.id)}>거절</button>
                    </div>
                  </div>
                  <p>요청 토지: {deal.Land?.full_name}</p>
                  <p>요청 가격: {Number(deal.price).toLocaleString('ko-KR')}원</p>
                </div>
                ) : (
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <p>내가 보낸 요청: {deal.Land?.full_name}</p>
                    <p>{deal.status === 'PENDING' && '대기 중'}</p>
                  </div>
                  <p>요청 가격: {Number(deal.price).toLocaleString('ko-KR')}원</p>
                </div>)
              }
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default DealList;