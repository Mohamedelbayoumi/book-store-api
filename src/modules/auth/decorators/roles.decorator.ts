import { SetMetadata } from '@nestjs/common'

import { Role } from '../enums/roles.enum'

export const RolePermission = (roles: Role) => SetMetadata('roles', roles)