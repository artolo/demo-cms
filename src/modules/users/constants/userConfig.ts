import type { UserPermission, UserPermissionConfig, UserStatus, UserStatusConfig } from '@/modules/users/types/userType.ts';

export const userPermissionConfig: Record<UserPermission, UserPermissionConfig> = {
    super_admin: {
        label: 'Super administrator',
        description: 'Pełny dostęp do wszystkich funkcji systemu.',
    },
    admin: {
        label: 'Administrator',
        description: 'Zarządzanie użytkownikami i konfiguracją systemu.',
    },
    manager: {
        label: 'Manager',
        description: 'Zarządzanie zespołem i przypisanymi zasobami.',
    },
    editor: {
        label: 'Edytor',
        description: 'Tworzenie i edycja dostępnych zasobów.',
    },
    user: {
        label: 'Użytkownik',
        description: 'Podstawowy dostęp do systemu.',
    },
};

export const userStatusConfig: Record<UserStatus, UserStatusConfig> = {
    active: {
        label: 'Aktywny',
        severity: 'success',
    },
    inactive: {
        label: 'Nieaktywny',
        severity: 'secondary',
    },
    pending: {
        label: 'Oczekujący',
        severity: 'warn',
    },
};
