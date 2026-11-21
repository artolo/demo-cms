import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { useUsersStore } from '@/modules/users/stores/usersStore.ts';
import { useNotificationStore } from '@/stores/notificationStore.ts';
import usersActionsApi from '@/modules/users/api/usersActionsApi.ts';
import type { UserFormData, User } from '@/modules/users/types/userType.ts';

export const useUsersActionsStore = defineStore('UsersActionsStore', {
    state: () => ({
        isSaving: false,
    }),

    actions: {
        async addUser(payload: UserFormData): Promise<User> {
            const usersStore = useUsersStore();
            const notificationStore = useNotificationStore();

            this.isSaving = true;

            try {
                const response = await usersActionsApi.addUser(payload);
                const nextId = Math.max(0, ...usersStore.users.map((user) => user.id)) + 1;

                const newUser: User = {
                    ...response,
                    id: nextId,
                    status: 'pending',
                    details: {
                        ...response.details,
                        joinedAt: format(new Date(), 'yyyy-MM-dd'),
                    },
                };

                usersStore.users.push(newUser);
                notificationStore.addNotification({
                    summary: 'Sukces',
                    detail: 'Utworzono nowego użytkownika',
                    severity: 'success',
                    timeout: 3000,
                });

                return newUser;
            } catch (error: unknown) {
                notificationStore.addNotification({
                    summary: 'Błąd',
                    detail: 'Nie udało się utworzyć użytkownika. Spróbuj ponownie.',
                    severity: 'error',
                    timeout: 4000,
                });

                throw error;
            } finally {
                this.isSaving = false;
            }
        },
    },
});
