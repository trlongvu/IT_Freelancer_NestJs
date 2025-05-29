import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';

interface CustomerRequest extends Request {
  route: {
    path: string;
  };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: IUser,
    info: any,
    context: ExecutionContext,
  ): any {
    const request: CustomerRequest = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }

    const targetMethod = request.method;
    const targetEndpoint = request.route?.path;

    const permissions = user?.permissions ?? [];
    let isExist: any = permissions.find(
      (permission) =>
        permission.method === targetMethod &&
        permission.apiPath === targetEndpoint,
    );
    if (targetEndpoint.startsWith('/api/v1/auth')) isExist = true;
    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException('You do not have permission');
    }

    return user;
  }
}
