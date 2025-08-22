import { io, Socket } from 'socket.io-client';

const URL = 'http://localhost:3000/chat'; // The chat namespace URL

export const createSocket = (token: string | null): Socket => {
  const socket = io(URL, {
    auth: {
      token: token,
    },
    autoConnect: false, // We will connect manually
  });

  return socket;
};
