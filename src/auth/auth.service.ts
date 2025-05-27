import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import ms, { StringValue } from 'ms';
import { permission } from 'process';
import { USER_ROLE } from 'src/databases/sample';
import { RolesService } from 'src/roles/roles.service';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,

    private usersService: UsersService,
    private roleService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isMatch = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isMatch) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.roleService.findOne(userRole._id);
        const objUser = {
          ...user,
          permissions: temp?.permissions ?? [],
        };
        return objUser;
      }
    }
    return null;
  }

  async register(body: RegisterUserDto) {
    const user = await this.usersService.findOneByEmail(body.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const userRole = await this.roleModel.findOne({
      name: USER_ROLE,
      isDeleted: false,
    });
    const newUser = await this.userModel.create({
      ...body,
      password: await this.usersService.getHashPassword(body.password),
      role: userRole?._id,
    });
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async login(user: IUser, res: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'Token login',
      iss: 'From server',
      _id,
      email,
      name,
      role,
    };

    const refresh_token = this.createRefreshToken({
      ...payload,
      sub: 'Token refresh',
    });

    await this.usersService.updateUserToken(_id, refresh_token);
    const userRole = user.role as unknown as { _id: string; name: string };
    const temp = await this.roleService.findOne(userRole._id);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as StringValue,
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions: temp?.permissions ?? [],
      },
    };
  }

  createRefreshToken = (payload) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(
          this.configService.get<string>(
            'JWT_REFRESH_EXPIRES_IN',
          ) as StringValue,
        ) / 1000,
    });
  };

  refreshToken = async (refresh_token: string, res: Response) => {
    if (!refresh_token) {
      throw new BadRequestException('Refresh token missing');
    }
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refresh_token);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const payload = {
        sub: 'Token refresh',
        iss: 'From server',
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const new_refresh_token = this.createRefreshToken(payload);
      await this.usersService.updateUserToken(
        user._id.toString(),
        new_refresh_token,
      );

      const userRole = user.role as unknown as { _id: string; name: string };
      const temp = await this.roleService.findOne(userRole._id);

      res.clearCookie('name');
      res.cookie('refresh_token', new_refresh_token, {
        httpOnly: true,
        maxAge: ms(
          this.configService.get<string>(
            'JWT_REFRESH_EXPIRES_IN',
          ) as StringValue,
        ),
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: temp?.permissions ?? [],
        },
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Refresh token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Refresh token invalid');
      }
      throw new BadRequestException('Something went wrong');
    }
  };

  logout = async (user: IUser, res: Response) => {
    await this.usersService.updateUserToken(user._id, '');
    res.clearCookie('refresh_token');
    return {};
  };
}
