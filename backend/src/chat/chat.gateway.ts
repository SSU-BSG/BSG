import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/chat.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { matchGroupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { matchGroupId } = data;
    const roomName = `matchGroup-${matchGroupId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room ${roomName}`);

    // Send previous messages to the user
    const messages = await this.chatService.getMessages(matchGroupId);
    client.emit('previousMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // The user object should be attached to the request by the AuthGuard
    const user = (client.request as any).user;
    const message = await this.chatService.createMessage(
      createMessageDto,
      user.id,
    );

    const roomName = `matchGroup-${createMessageDto.matchGroupId}`;
    this.server.to(roomName).emit('newMessage', message);
  }
}
