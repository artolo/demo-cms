import type { UserFormData } from '@/modules/users/types/userType.ts';

const usersActionsApi = {
    async addUser(payload: UserFormData): Promise<UserFormData> {
        return Promise.resolve(payload);
    },

    async updateUser(payload: UserFormData): Promise<UserFormData> {
        return Promise.resolve(payload);
    },

    async deleteUser(userId: number): Promise<void> {
        return Promise.resolve();
    },
};

export default usersActionsApi;
