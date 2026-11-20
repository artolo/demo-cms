import type { User } from '@/modules/users/types/userType.ts';

export interface UsersStoreType {
    users: User[];
    isLoading: boolean;
}
