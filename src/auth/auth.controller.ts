import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as IUser);
  }

  // @UseGuards(JwtAuthGuard) // Da su dung global
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
