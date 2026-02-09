import { useEffect, useState } from "react";
import api from "../../common/api";
import Login from "../login/login";
import Register from "../register/register";
import LOGGEDIN from "../loggedin/loggedin";

const Controller = () => {
  const [side, setSide] = useState<'LEFT' | 'RIGHT'>('LEFT');
  const [authMode, setAuthMode] = useState<'REGISTER' | 'LOGIN' | 'LOGGED_IN'>('LOGIN');

  const toggleSide = () => setSide(prev => prev === 'LEFT' ? 'RIGHT' : 'LEFT');

  const toggleAuthMode = () => {
    if (authMode === 'LOGGED_IN') {
      localStorage.clear();
      setAuthMode('LOGIN');
      alert('로그아웃 성공');
    } else {
      setAuthMode(prev => prev === 'LOGIN' ? 'REGISTER' : 'LOGIN');
    }
  }

  useEffect(() => {
    const isValidToken = async () => {
      try {
        const res = await api(`${import.meta.env.VITE_BACKEND_URL}/user/favorites`);

        if (res.status !== 401) setAuthMode('LOGGED_IN');
        else setAuthMode('LOGIN');
      } catch(error) {
        setAuthMode('LOGIN');
      }
    }

    isValidToken();
  }, []);

  return (
    <div className={`
      relative z-[2000] h-full w-full pointer-events-none
      flex items-center justify-${side === 'LEFT' ? 'end' : 'start'}
    `}>
      <div className="
        h-full w-[30%] bg-gray-500/50 pointer-events-auto rounded-xl
        flex flex-col items-center justify-between p-10
      ">
        <div className="h-full w-full">
          {authMode === 'LOGIN' && <Login setAuthMode={setAuthMode} />}
          {authMode === 'REGISTER' && <Register setAuthMode={setAuthMode} />}
          {authMode === 'LOGGED_IN' && <LOGGEDIN />}
        </div>
        <div>
          <button
            className="bg-white h-[30px] w-[120px] rounded-xl text-xs font-bold m-2"
            onClick={toggleSide}
          >
            Move To {side === 'LEFT' ? 'Left' : 'Right'}
          </button>
          <button
            className="bg-white h-[30px] w-[120px] rounded-xl text-xs font-bold  m-2"
            onClick={toggleAuthMode}
          >
            {authMode === 'LOGGED_IN' ? 'Logout' : authMode === 'LOGIN' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controller;