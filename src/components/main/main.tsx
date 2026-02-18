import { useEffect, useState } from "react";
import Land from "../land/land";
import User from "../user/user";
import type { landType } from "../../common/types/land.type";
import Map from "../map/map";
import { useNavigate } from "react-router-dom";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import type { userType } from "../../common/types/user.type";
import { landSocket } from "../../common/socket";

const Main = () => {
  const navigate = useNavigate();
  const [land, setLand] = useState<landType | null>(null);
  const [lands, setLands] = useState<landType[]>([]);
  const [userLands, setUserLands] = useState<landType[]>([]);
  const [profile, setProfile] = useState<userType | null>(null);
  const EventSource = EventSourcePolyfill || NativeEventSource;

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    landSocket.connect();

    landSocket.on('list', (data) => {
      setLands(data.lands);
    });

    landSocket.on('my', (data) => {
      setUserLands(data.lands);
    });

    landSocket.on('error_custom', (error) => {
      console.error(error)
      console.log('Land Socket: ', error.message);
    });

    const userProfileEventSource = new EventSource(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
      
    userProfileEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setProfile(data.user);
      } catch(error) {
        console.error(error);
      }
    };
    
    userProfileEventSource.onerror = (error) => {
      console.error(error);
      userProfileEventSource.close();
    };
    
    return () => {
      userProfileEventSource.close();
      landSocket.close();
    }
  }, []);

  return (
    <div>
      <Map />
      <div className='absolute inset-0 pointer-events-none z-[2000] p-12'>
        <User landSocket={landSocket} profile={profile} land={land} setLand={setLand} />
        <Land lands={lands} landSocket={landSocket} userLands={userLands} setUserLands={setUserLands} setLand={setLand} />
      </div>
    </div>
  );
}

export default Main;