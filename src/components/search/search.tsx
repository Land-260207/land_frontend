import React, { useState, useEffect } from "react";
import type { landType } from "../../common/types/land.type";

type SearchProps = {
  lands: landType[],
  setLand: React.Dispatch<React.SetStateAction<landType | null>>;
};

const Search = ({ lands, setLand }: SearchProps) => {
  const [landInput, setLandInput] = useState('');
  const [landList, setLandList] = useState<landType[]>([]);

  useEffect(() => {
    const _lands = lands.filter((land) => land.full_name.includes(landInput));

    setLandList(_lands);
  }, [lands, landInput]);

  return (
    <div className="relative w-full h-[50%] rounded-xl bg-white/80 shadow-xl pointer-events-auto">
      <input
        type="text"
        value={landInput}
        onChange={(e) => setLandInput(e.target.value)}
        placeholder="토지 검색 (예: 강동구)"
        className="w-full px-4 py-3 text-base rounded-xl focus:outline-none"
      />

      <div className="h-[82%] rounded-xl overflow-y-auto">
        {landList.map((land) => (
          <div
            key={land.sig_cd}
            className="flex items-center justify-between px-4 py-3 cursor-pointer"
            onClick={() => {
              setLand(land);
              setLandInput('');
            }}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">{land.name}</div>
              <div className="text-xs text-gray-600">
                {land.full_name} · {Number(land.price).toLocaleString("ko-KR")}원 · 소유자: {land.Owner?.username || '없음'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;