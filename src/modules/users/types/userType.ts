export type UserPermission = 'super_admin' | 'admin' | 'manager' | 'editor' | 'user';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserDetails {
    department: string;
    location: string;
    joinedAt: string;
    lastLogin: string;
    phone: string;
    bio: string;
    skills: string[];
}

export interface UserBase {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    permission: UserPermission;
}

export interface UserFormData extends UserBase {
    phone: string;
}

export interface User extends UserBase {
    id: number;
    status: UserStatus;
    details: UserDetails;
}

export interface UserPermissionConfig {
    label: string;
    description: string;
}

export interface UserStatusConfig {
    label: string;
    severity: 'success' | 'secondary' | 'warn';
}
