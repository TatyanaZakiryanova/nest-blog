import { Role } from 'src/users/role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}
