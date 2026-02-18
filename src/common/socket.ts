import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_BACKEND_URL;

const options = {
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
};

export const landSocket = io(`${WS_URL}/land`, options);
export const dealSocket = io(`${WS_URL}/deal`, options);