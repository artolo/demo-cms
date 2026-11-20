import type { AuthResponse, LoginCredentials } from '../types/authType';
import { mockAuthResponse } from '@/mocks/authMock';

export default {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const isValidCredentials = credentials.email === 'admin@demo.pl' && credentials.password === 'Demo123!';

        if (!isValidCredentials) {
            throw new Error('Nieprawidłowy adres e-mail lub hasło.');
        }

        return mockAuthResponse;
    },
};
