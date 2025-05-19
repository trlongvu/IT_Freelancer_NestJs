import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isMatch = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'Token login',
      iss: 'From server',
      _id,
      email,
      name,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }
}
