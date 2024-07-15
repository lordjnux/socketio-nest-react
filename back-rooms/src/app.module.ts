import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatRoomsGateway } from './chat-rooms/chat-rooms.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatRoomsGateway],
})
export class AppModule {}
