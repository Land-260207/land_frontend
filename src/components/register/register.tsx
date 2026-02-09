import { useState } from "react";
import api from "../../common/api";

type RegisterProps = {
  setAuthMode: React.Dispatch<React.SetStateAction<'REGISTER' | 'LOGIN' | 'LOGGED_IN'>>
}

const Register = ({ setAuthMode }: RegisterProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }
    if (username.length < 4 || username.length > 15) {
      setError("아이디는 4~15자 사이여야 합니다.");
      return;
    }
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "회원가입에 실패했습니다.");
        return;
      }

      setAuthMode('LOGIN');
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
    } catch (err) {
      console.error(err);
      setError("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
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
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg text-center">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="username: 4~15 characters"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
        onKeyDown={handleKeyDown}
        autoComplete="username"
        disabled={isLoading}
        className="
          pl-3 pr-3 rounded-xl
          border-none focus:outline-none
          text-sm h-[30px] w-[300px]
        "
      />

      <input
        type="password"
        placeholder="password: 7 or more characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="new-password"
        disabled={isLoading}
        className="
          pl-3 pr-3 rounded-xl
          border-none focus:outline-none
          text-sm h-[30px] w-[300px]
        "
      />

      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="bg-white h-[30px] w-[120px] rounded-xl text-xs font-bold m-2"
      >
        {isLoading ? '가입 중...' : 'REGISTER'}
      </button>
    </div>
  );
};

export default Register;