import { Injectable } from '@nestjs/common';
// import { Server, Socket } from 'socket.io';
// import { EventsSocket } from './events.enum';

@Injectable()
export class SocketService {
  // private readonly clientsConnected: Map<string, Socket> = new Map();
  // handleClientConnections(socket: Server): void {
  //   const clientId = socket.id;
  //   const disconectedListener = () => {
  //     this.clientsConnected.delete(clientId);
  //   };
  //   this.clientsConnected.set(clientId, socket);
  //   socket.on(EventsSocket.disconnect, disconectedListener);
  // }
}
