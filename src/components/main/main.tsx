import { useEffect, useState } from "react";
import Land from "../land/land";
import User from "../user/user";
import type { landType } from "../../common/types/land.type";
import Map from "../map/map";
import { useNavigate } from "react-router-dom";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import type { userType } from "../../common/types/user.type";

const Main = () => {
  const navigate = useNavigate();
  const [land, setLand] = useState<landType | null>(null);
  const [profile, setProfile] = useState<userType | null>(null);
  const EventSource = EventSourcePolyfill || NativeEventSource;

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      localStorage.clear();
      navigate('/login');
      return;
    }

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
    }
  }, []);

  return (
    <div>
      <Map />
      <div className='absolute inset-0 pointer-events-none z-[2000] p-12'>
        <User profile={profile} land={land} setLand={setLand} />
        <Land profile={profile} setLand={setLand} />
      </div>
    </div>
  );
}

export default Main;