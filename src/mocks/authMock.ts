import type { AuthResponse } from '@/modules/auth/types/authType';

export const mockAuthResponse: AuthResponse = {
    token: 'demo-cms-mock-token',
    user: {
        id: 1,
        email: 'admin@demo.pl',
        firstName: 'Admin',
        lastName: 'Demo',
        role: 'admin',
    },
};
