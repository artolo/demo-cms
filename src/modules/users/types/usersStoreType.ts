import type { User } from '@/modules/users/types/userType.ts';

export interface UsersStoreType {
    users: User[];
    isLoading: boolean;
}
export interface UsersActionsStoreType {
    user: User | null;
    isSaving: boolean;
}
