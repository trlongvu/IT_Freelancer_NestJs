import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('Register successfully')
  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @ResponseMessage('Login successfully')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, res);
  }

  // @UseGuards(JwtAuthGuard) // Da su dung global
  @Get('account')
  @ResponseMessage('Get account successfully')
  getAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Post('refresh-token')
  @ResponseMessage('Refresh token successfully')
  handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'] as string;
    return this.authService.refreshToken(refresh_token, res);
  }

  @Post('logout')
  @ResponseMessage('Logout successfully')
  logout(@User() user: IUser, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(user, res);
  }
}
