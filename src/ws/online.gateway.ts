import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', //client url
  },
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('OnlineGateway');

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        this.logger.warn('No token provided');
        throw new WsException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        this.logger.warn('User not found');
        throw new WsException('User not found');
      }

      user.isActive = true;
      await this.usersRepository.save(user);
      this.logger.log(`User ${user.id} is now ONLINE`);
    } catch (err) {
      this.logger.error('Socket connection error:', err.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        this.logger.warn('Disconnect: no token provided');
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        this.logger.warn('Disconnect: user not found');
        return;
      }

      user.isActive = false;
      await this.usersRepository.save(user);
      this.logger.log(`User ${user.id} is now OFFLINE`);
    } catch (err) {
      this.logger.error('Socket disconnect error:', err.message);
    }
  }
}
