import { defineStore, acceptHMRUpdate } from 'pinia';
import authApi from '../api/authApi';
import { authSessionStorage } from './authSessionStorage';
import type { AuthUser, LoginCredentials } from '../types/authType';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isSessionRestored: boolean;
    isLoading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        user: null,
        isSessionRestored: false,
        isLoading: false,
        error: null,
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

        async login(credentials: LoginCredentials): Promise<boolean> {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await authApi.login(credentials);

                this.token = response.token;
                this.user = response.user;

                authSessionStorage.value = {
                    token: response.token,
                    user: response.user,
                };

                this.isSessionRestored = true;

                return true;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd.';

                return false;
            } finally {
                this.isLoading = false;
            }
        },

        logout(): void {
            this.token = null;
            this.user = null;
            this.error = null;

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
