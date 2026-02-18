import { useEffect, useState } from "react";
import type { userType } from "../../common/types/user.type";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

const Rank = () => {
  const EventSource = EventSourcePolyfill || NativeEventSource;
  const [rank, setRank] = useState<userType[] | null>(null);

  useEffect(() => {
    const userRankEventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/user/rank`);
    
    userRankEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setRank(data.users);
      } catch(error) {
        console.error(error);
      }
    };
    
    userRankEventSource.onerror = (error) => {
      console.error(error);
      userRankEventSource.close();
    };
    
    return () => {
      userRankEventSource.close();
    }
  }, []);

  return (
    <div className="font-semibold h-[36%] w-full bg-white/80 p-5 shadow-xl rounded-xl pointer-events-auto">
      <p className="mb-5 text-2xl">랭킹</p>
      {rank ? (
        rank.map((user: userType, index: number) => (
          <div key={user.username} className="mb-3">
            {index + 1}. {user.username}<br />
            {Number(user.balance).toLocaleString('ko-KR')}원
          </div>
        ))
      ) : (
        '랭킹 불러오는 중...'
      )}
    </div>
  );
}

export default Rank;