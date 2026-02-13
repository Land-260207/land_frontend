import { useState } from "react";
import api from "../../common/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', {
        username, password
      });

      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('username', username);
      navigate('/main')
    } catch(error: any) {
      console.error(error);
      setError(error.response.data.message || '서버 통신 오류');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
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
        placeholder="아이디"
        onKeyDown={handleKeyDown}
        className="pl-3 pr-3 rounded-xl border-none focus:outline-none text-sm h-[5%] w-[30%] shadow-lg"
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="비밀번호"
        onKeyDown={handleKeyDown}
        className="pl-3 pr-3 rounded-xl border-none focus:outline-none text-sm h-[5%] w-[30%] shadow-lg"
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-white h-[30px] w-[100px] rounded-xl text-xs font-bold m-2 shadow-lg"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        <button
          onClick={() => navigate('/register')}
          disabled={isLoading}
          className="bg-white h-[30px] w-[100px] rounded-xl text-xs font-bold m-2 shadow-lg"
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
};

export default Login;