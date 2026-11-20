import type { AuthResponse, LoginCredentials } from '../types/authType';
import { mockAuthResponse } from '@/mocks/authMock';
import { DEFAULT_USER_LOGIN, DEFAULT_USER_PASS } from '@/constants.ts';

export default {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const isValidCredentials = credentials.email === DEFAULT_USER_LOGIN && credentials.password === DEFAULT_USER_PASS;

        if (!isValidCredentials) {
            throw new Error('Nieprawidłowy adres e-mail lub hasło.');
        }

        return mockAuthResponse;
    },
};
