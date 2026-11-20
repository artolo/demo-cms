import { defineStore, acceptHMRUpdate } from 'pinia';
import authApi from '../api/authApi';
import { authSessionStorage } from './authSessionStorage';
import type { AuthUser, LoginCredentials } from '../types/authTypes';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isSessionRestored: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        user: null,
        isSessionRestored: false,
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.token,
        getUser: (state): AuthUser | null => state.user,
    },

    actions: {
        restoreSession(): void {
            const { token, user } = authSessionStorage.value;

            if (!token || !user) {
                this.token = null;
                this.user = null;
                authSessionStorage.value = {
                    token: null,
                    user: null,
                };
            } else {
                this.token = token;
                this.user = user;
            }

            this.isSessionRestored = true;
        },

        async login(credentials: LoginCredentials): Promise<void> {
            const response = await authApi.login(credentials);

            this.token = response.token;
            this.user = response.user;

            authSessionStorage.value = {
                token: response.token,
                user: response.user,
            };

            this.isSessionRestored = true;
        },

        logout(): void {
            this.token = null;
            this.user = null;

            authSessionStorage.value = {
                token: null,
                user: null,
            };

            this.isSessionRestored = true;
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
