import { defineStore } from 'pinia';
import usersApi from '@/modules/users/api/usersApi.ts';
import type { User } from '@/modules/users/types/userType.ts';
import type { UsersStoreType } from '@/modules/users/types/usersStoreType.ts';

export const useUsersStore = defineStore('UsersStore', {
    state: (): UsersStoreType => ({
        users: [],
        isLoading: false,
    }),
    getters: {
        activeUsers: (state): User[] => state.users.filter((user) => user.status === 'active'),
        inactiveUsers: (state): User[] => state.users.filter((user) => user.status === 'inactive'),
        pendingUsers: (state): User[] => state.users.filter((user) => user.status === 'pending'),
        usersCount: (state): number => state.users.length,
    },
    actions: {
        assignUsers(users: User[]): void {
            this.users = users;
        },
        async getUsersList(): Promise<void> {
            this.isLoading = true;

            try {
                const response = await usersApi.getUsers();
                this.assignUsers(response);
            } finally {
                this.isLoading = false;
            }
        },
        clearUsers(): void {
            this.users = [];
        },
    },
});
