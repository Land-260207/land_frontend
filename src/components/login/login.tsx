import { useState } from "react";
import api from "../../common/api";

type LoginProps = {
  setAuthMode: React.Dispatch<React.SetStateAction<'REGISTER' | 'LOGIN' | 'LOGGED_IN'>>
}

const Login = ({ setAuthMode }: LoginProps) => {
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
      const response = await api(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "로그인에 실패했습니다.");
        return;
      }

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('username', username);
      setAuthMode('LOGGED_IN');

    } catch (err) {
      console.error(err);
      setError("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
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
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="username"
        onKeyDown={handleKeyDown}
        className="
          pl-3 pr-3 rounded-xl
          border-none focus:outline-none
          text-sm h-[30px] w-[300px]
        "
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="password"
        onKeyDown={handleKeyDown}
        className="
          pl-3 pr-3 rounded-xl
          border-none focus:outline-none
          text-sm h-[30px] w-[300px]
        "
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-white h-[30px] w-[120px] rounded-xl text-xs font-bold m-2"
      >
        {isLoading ? '로그인 중...' : 'LOGIN'}
      </button>
    </div>
  );
};

export default Login;