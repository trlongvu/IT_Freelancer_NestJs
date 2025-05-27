import { Permission } from 'src/permissions/schemas/permission.schema';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: Permission[];
}
