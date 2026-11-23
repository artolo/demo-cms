import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { useUsersStore } from '@/modules/users/stores/usersStore.ts';
import { useNotificationStore } from '@/stores/notificationStore.ts';
import usersActionsApi from '@/modules/users/api/usersActionsApi.ts';
import type { UserFormData, User } from '@/modules/users/types/userType.ts';
import type { UsersActionsStoreType } from '@/modules/users/types/usersStoreType.ts';

type ActionConfig = {
    successMessage: string;
    errorMessage: string;
};

export const useUsersActionsStore = defineStore('UsersActionsStore', {
    state: (): UsersActionsStoreType => ({
        isSaving: false,
        user: null,
    }),

    actions: {
        async executeAction<T>(callback: () => Promise<T>, config: ActionConfig): Promise<T> {
            const notificationStore = useNotificationStore();

            this.isSaving = true;

            try {
                const result = await callback();

                notificationStore.addNotification({
                    summary: 'Sukces',
                    detail: config.successMessage,
                    severity: 'success',
                    timeout: 3000,
                });

                return result;
            } catch (error: unknown) {
                notificationStore.addNotification({
                    summary: 'Błąd',
                    detail: config.errorMessage,
                    severity: 'error',
                    timeout: 4000,
                });

                throw error;
            } finally {
                this.isSaving = false;
            }
        },

        async addUser(payload: UserFormData): Promise<User> {
            const usersStore = useUsersStore();

            return this.executeAction(
                async () => {
                    const response = await usersActionsApi.addUser(payload);

                    const nextId = Math.max(0, ...usersStore.users.map((user) => user.id)) + 1;

                    const newUser: User = {
                        ...response,
                        id: nextId,
                        status: 'pending',
                        details: {
                            department: '',
                            location: '',
                            joinedAt: format(new Date(), 'yyyy-MM-dd'),
                            lastLogin: '',
                            phone: response.phone,
                            bio: '',
                            skills: [],
                        },
                    };

                    usersStore.users.push(newUser);

                    return newUser;
                },
                {
                    successMessage: 'Utworzono nowego użytkownika',
                    errorMessage: 'Nie udało się utworzyć użytkownika. Spróbuj ponownie.',
                },
            );
        },

        async updateUser(payload: UserFormData): Promise<User> {
            const usersStore = useUsersStore();

            if (!this.user) {
                throw new Error('Brak użytkownika do edycji.');
            }

            const userId = this.user.id;

            return this.executeAction(
                async () => {
                    const currentUser = usersStore.users.find((user) => user.id === userId);

                    if (!currentUser) {
                        throw new Error('Nie znaleziono użytkownika do aktualizacji.');
                    }

                    const response = await usersActionsApi.updateUser(payload);

                    const updatedUser: User = {
                        ...currentUser,
                        ...response,
                    };

                    const userIndex = usersStore.users.findIndex((user) => user.id === userId);

                    if (userIndex === -1) {
                        throw new Error('Nie znaleziono użytkownika do aktualizacji.');
                    }

                    usersStore.users[userIndex] = updatedUser;

                    return updatedUser;
                },
                {
                    successMessage: 'Zaktualizowano dane użytkownika',
                    errorMessage: 'Nie udało się zaktualizować użytkownika. Spróbuj ponownie.',
                },
            );
        },

        async deleteUser(userId: number): Promise<void> {
            const usersStore = useUsersStore();

            return this.executeAction(
                async () => {
                    const userIndex = usersStore.users.findIndex((user) => user.id === userId);

                    if (userIndex === -1) {
                        throw new Error('Nie znaleziono użytkownika do usunięcia.');
                    }

                    await usersActionsApi.deleteUser(userId);

                    usersStore.users.splice(userIndex, 1);
                },
                {
                    successMessage: 'Usunięto użytkownika',
                    errorMessage: 'Nie udało się usunąć użytkownika. Spróbuj ponownie.',
                },
            );
        },
    },
});
