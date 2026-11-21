import type { User, UserFormData } from '@/modules/users/types/userType.ts';

const usersActionsApi = {
    async addUser(payload: UserFormData): Promise<User> {
        return Promise.resolve({
            ...payload,
            id: 0,
            status: 'pending',
            details: {
                department: '',
                location: '',
                joinedAt: '',
                lastLogin: '',
                phone: payload.phone,
                bio: '',
                skills: [],
            },
        });
    },
};

export default usersActionsApi;
