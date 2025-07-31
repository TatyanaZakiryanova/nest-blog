import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: {
      token?: string;
    };
  };
}
