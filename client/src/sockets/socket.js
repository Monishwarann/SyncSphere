import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

// Instantiates a customizable socket client connection (keeps auto-connect disabled initially)
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
