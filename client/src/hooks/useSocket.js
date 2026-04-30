import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      const newSocket = io({
        path: '/socket.io',
        auth: { token },
      });

      newSocket.on('connect', () => {
        newSocket.emit('authenticate', token);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return socket;
};

export default useSocket;
