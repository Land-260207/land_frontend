import { useEffect, useState } from "react";
import type { dealType } from "../../common/types/deal.type";

type DealListProps = {
  dealSocket: any,
  landSocket: any
}

const DealList = ({ dealSocket, landSocket }: DealListProps) => {
  const [deals, setDeals] = useState<dealType[]>([]);

  useEffect(() => {
    dealSocket.on('list', (data: any) => {
      setDeals(data.deals);
    });
  }, []);

  const handleAcceptDeal = (deal_id: number, buyer_id: number) => {
    dealSocket.emit('accept', deal_id);
    landSocket.emit('list', buyer_id);
  };

  const handleRejectDeal = (deal_id: number) => {
    dealSocket.emit('reject', deal_id);
  };

  const handleCancel = (deal_id: number) => {
    dealSocket.emit('cancel', deal_id);
  };

  return (
    <div className="font-semibold h-[33%] w-full bg-white/80 shadow-xl rounded-xl pointer-events-auto">
      <p className="m-5 text-center">거래 요청 목록</p>
      <ul className="w-full h-[70%]">
        {deals.map((deal) => {
          return (
            <li key={deal.id} className="w-full h-[40%] text-sm rounded-xl pl-5 pr-5 font-semibold">
              {deal.Owner?.username === localStorage.getItem('username') ? (
                <div>
                  <div className="flex justify-between">
                    <p>요청자: {deal.Buyer?.username}</p>
                    <div className="flex gap-5">
                      <button onClick={() => handleAcceptDeal(deal.id, deal.buyer_id)}>수락</button>
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
                  <div className="flex justify-between">
                    <p>요청 가격: {Number(deal.price).toLocaleString('ko-KR')}원</p>
                    <button onClick={() => handleCancel(deal.id)}>취소</button>
                  </div>
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