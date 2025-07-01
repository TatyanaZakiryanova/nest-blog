import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
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
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        this.logger.warn('User not found');
        client.disconnect();
        return;
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
      if (!token) return;

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });
      if (!user) return;

      user.isActive = false;
      await this.usersRepository.save(user);
      this.logger.log(`User ${user.id} is now OFFLINE`);
    } catch (err) {
      this.logger.error('Socket disconnect error:', err.message);
    }
  }
}
