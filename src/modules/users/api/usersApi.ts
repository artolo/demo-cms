import type { User } from '@/modules/users/types/userType.ts';
import { usersMock } from '@/mocks/usersMock.ts';

const usersApi = {
    async getUsers(): Promise<User[]> {
        return Promise.resolve(usersMock);
    },
};

export default usersApi;
