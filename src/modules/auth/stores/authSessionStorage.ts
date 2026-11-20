import { useSessionStorage } from '@vueuse/core';
import type { AuthUser } from '../types/authType';

export interface AuthSessionStorageType {
    token: string | null;
    user: AuthUser | null;
}

const DEFAULT_SESSION: AuthSessionStorageType = {
    token: null,
    user: null,
};

export const authSessionStorage = useSessionStorage<AuthSessionStorageType>('demo-cms-auth-session', DEFAULT_SESSION, {
    mergeDefaults: true,
});
