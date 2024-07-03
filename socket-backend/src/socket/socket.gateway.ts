import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { SocketService } from './socket.service';

@WebSocketGateway(
  8083, // TODO: <--- variable de entorno
  {
    // * segundo parámetro: options
    cors: { origin: '*' }, // TODO: <--- cambiar por la recomendación segura para la app [* = Allow all something]
  },
)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  afterInit(server: any) {
    console.log('SocketGateway OnInit...');
    // console.log(
    //   'server(opts, clientsCount, clients):',
    //   server.opts,
    //   server.clientsCount,
    //   server.cllients,
    // );
  }

  handleConnection(client: any, ...args: any[]) {
    console.info('Client connected...');
    // console.log('client:', client);
    // console.log('args:', args);
  }

  handleDisconnect(client: any) {
    console.warn('Client disconnected...');
    // console.log('client:', client);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: 'string') {
    console.warn('Client join-room...');
    console.log('client:', client.id);
    console.log('room:', room);
    client.join(`room-${room}`);
  }

  @SubscribeMessage('message-sent')
  handleIncomminMessage(
    client: Socket,
    payload: { room: string; message: string },
  ) {
    console.warn('server:message-sent...');
    console.log(payload);

    this.server.emit('newMessage', payload);
  }

  @SubscribeMessage('room-leave')
  handleRoomLeave(client: Socket, room: string) {
    console.warn('Client room-leave...');
    // console.log('client:', client);
    // console.log('room:', room);
    // client.leave(`room-${room}`);
  }
}
