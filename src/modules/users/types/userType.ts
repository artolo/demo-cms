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

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    permission: UserPermission;
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
