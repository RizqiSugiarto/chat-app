import { VITE_SERVER_URL } from '@/utils/constants';
import { SocketContextType } from '@/utils/types';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/hooks/useAllContextHooks';

export const SocketContext = createContext<SocketContextType | null>(null);

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);
    const { loggedInUser } = useAuthContext()!;
    const token = useMemo(() => localStorage.getItem('access-token'), []);

    useEffect(() => {
        if (token) {
            try {
                const socketInstance = io(VITE_SERVER_URL, {
                    auth: { token },
                });
                if (socketInstance) {
                    setSocket(socketInstance);
                }
            } catch (error) {
                console.log(error);
                toast.error(
                    error?.toString() ??
                        'Error establishing websocket connection',
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    },
                );
                navigate('/auth');
            }
        }
    }, [token, navigate]);

    useEffect(() => {
        const handleConnect = () => {
            if (socket && loggedInUser?.user?.id) {
                socket.emit('connectedUser', loggedInUser.user.id);
            }
        };

        const handleDisconnect = () => {
            if (socket && loggedInUser?.user?.id) {
                socket.emit('disconnectedUser', loggedInUser.user.id);
            }
        };

        if (
            socket &&
            loggedInUser &&
            loggedInUser.isAuthenticated &&
            loggedInUser.user
        ) {
            socket.on('connect', handleConnect);
            socket.on('disconnect', handleDisconnect);

            return () => {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
            };
        }
    }, [socket, loggedInUser?.isAuthenticated, loggedInUser?.user?.id]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
