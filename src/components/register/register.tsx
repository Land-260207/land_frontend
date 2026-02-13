import { useState } from "react";
import api from "../../common/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (username.length < 4 || username.length > 15) {
      setError("아이디는 4~15자 사이여야 합니다.");
      return;
    }
    
    if (password.length < 7) {
      setError("비밀번호는 7자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/register', {
        username, password
      });

      navigate('/login')
    } catch(error: any) {
      console.error(error);
      setError(error.response.data.message || '서버 통신 오류');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRegister();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      {error && (
        <p className="px-4 py-2 text-sm font-medium text-center text-red-500 rounded-lg bg-red-50">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="아이디 4~15자"
        onKeyDown={handleKeyDown}
        className="pl-3 pr-3 rounded-xl border-none focus:outline-none text-sm h-[5%] w-[30%] shadow-lg"
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="비밀번호 7자 이상"
        onKeyDown={handleKeyDown}
        className="pl-3 pr-3 rounded-xl border-none focus:outline-none text-sm h-[5%] w-[30%] shadow-lg"
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <span>
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="bg-white h-[30px] w-[100px] rounded-xl text-xs font-bold m-2 shadow-lg"
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>

        <button
          onClick={() => navigate('/login')}
          disabled={isLoading}
          className="bg-white h-[30px] w-[100px] rounded-xl text-xs font-bold m-2 shadow-lg"
        >
          로그인하기
        </button>
      </span>
    </div>
  );
};

export default Register;