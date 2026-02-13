import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './components/login/login';
import Main from './components/main/main';
import Register from './components/register/register';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/main');
      return;
    }
    
    navigate('/login');
  }, []);
  
  return (
    <div className='relative flex-col w-screen h-screen p-12'>
      <Routes>
        <Route path='/main' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App