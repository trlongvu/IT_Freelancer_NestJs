import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (isInit === 'true') {
      const countUser = await this.userModel.countDocuments({
        isDeleted: false,
      });
      const countPermission = await this.permissionModel.countDocuments({
        isDeleted: false,
      });
      const countRole = await this.roleModel.countDocuments({
        isDeleted: false,
      });

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRole === 0) {
        const permissions = await this.permissionModel
          .find({ isDeleted: false })
          .select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Administrator role with all permissions',
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Normal user role with limited permissions',
            permissions: [],
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({
          name: ADMIN_ROLE,
          isDeleted: false,
        });
        const userRole = await this.roleModel.findOne({
          name: USER_ROLE,
          isDeleted: false,
        });

        await this.userModel.insertMany([
          {
            name: 'Admin',
            email: this.configService.get<string>('EMAIL_ADMIN') as string,
            password: await this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD') as string,
            ),
            role: adminRole?._id,
          },

          {
            name: 'Long Vu',
            email: 'vu65617@gmail.com',
            password: await this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD') as string,
            ),
            role: adminRole?._id,
          },
          {
            name: 'Normal User',
            email: 'user@gmail.com',
            password: await this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD') as string,
            ),
            role: userRole?._id,
          },
        ]);
      }
      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        // console.log(
        //   'Database already initialized with users, roles, and permissions.',
        // );
        this.logger.log(
          'Database already initialized with users, roles, and permissions.',
        );
      }
    }
  }
}
