import React, { useState, useCallback, useRef, useEffect } from "react";
import type { landType } from "../../common/types/land.type";
import api from "../../common/api";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

type SearchProps = {
  setLand: React.Dispatch<React.SetStateAction<landType | null>>;
};

const Search = ({ setLand }: SearchProps) => {
  const [landInput, setLandInput] = useState("");
  const [landList, setLandList] = useState<landType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      setError(null);

      const res = await api.get(`/land?query=${query}`);
        
      const lands = res.data.data.lands || [];
      setLandList(lands);

      if (lands.length === 0 && query.length > 1) {
        setError("검색 결과가 없습니다");
      }

      setIsLoading(false);
    }, 400),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLandInput(value);
    debouncedSearch(value);
  };

  const handleSelect = (land: landType) => {
    setLandInput(land.name);
    setLand(land);
    setLandList([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        listRef.current && !listRef.current.contains(event.target as Node)
      ) {
        setLandList([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-[50%]">
      <input
        ref={inputRef}
        type="text"
        value={landInput}
        onChange={handleChange}
        onFocus={() => debouncedSearch(landInput)}
        placeholder="토지 검색 (예: 강동구)"
        className="w-full px-4 py-3 text-base bg-white border-none shadow-lg rounded-xl focus:outline-none"
      />

      {isLoading && (
        <div className="absolute text-sm text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2">
          검색 중...
        </div>
      )}

      {(landList.length > 0 || error) && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 z-[10000] mt-3 max-h-[82%] overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-xl divide-y divide-gray-100"
        >
          {error && (
            <div className="px-4 py-4 text-sm text-center text-red-600 bg-red-50">
              {error}
            </div>
          )}

          {landList.map((land) => (
            <div
              key={land.sig_cd}
              className="flex items-center justify-between px-4 py-3 transition-colors cursor-pointer hover:bg-blue-50"
              onClick={() => handleSelect(land)}
            >
              <div className="flex flex-col">
                <div className="font-medium text-gray-900">{land.name}</div>
                <div className="text-xs text-gray-600">
                  {land.full_name} · {Number(land.price).toLocaleString("ko-KR")}원
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;