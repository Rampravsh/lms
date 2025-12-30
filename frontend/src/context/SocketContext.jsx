import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import api from '../api/axios';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Use environment variable for production, or dynamic hostname for local
            const socketUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
            const newSocket = io(socketUrl);

            setSocket(newSocket);

            newSocket.emit('join', user._id || user.id);

            newSocket.on('onlineUsers', (users) => {
                setOnlineUsers(users);
            });

            // Listen to real-time status checks if implemented in backend
            // newSocket.on('userStatusCheck', ...) 

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
