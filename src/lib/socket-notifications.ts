import { io, Socket } from 'socket.io-client';

export function connectNotifications(jwt: string): Socket {
  const socket = io('http://localhost:3000/notifications', {
    auth: { token: jwt },
    transports: ['websocket'], // opcional
  });

  socket.on('connected', (data) => {
    console.log('WS conectado', data);
  });

  socket.on('notification', (msg) => {
    console.log('Notificación recibida:', msg);
  });

  return socket;
}