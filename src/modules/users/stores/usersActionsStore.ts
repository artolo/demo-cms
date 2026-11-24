import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { useUsersStore } from '@/modules/users/stores/usersStore.ts';
import usersActionsApi from '@/modules/users/api/usersActionsApi.ts';
import { wrapRequestTryCatch } from '@/services/wrapRequestTryCatch';
import type { UserFormData, User } from '@/modules/users/types/userType.ts';
import type { UsersActionsStoreType } from '@/modules/users/types/usersStoreType.ts';

export const useUsersActionsStore = defineStore('UsersActionsStore', {
    state: (): UsersActionsStoreType => ({
        isSaving: false,
        user: null,
    }),

    actions: {
        async addUser(payload: UserFormData): Promise<User> {
            const usersStore = useUsersStore();

            this.isSaving = true;

            try {
                return await wrapRequestTryCatch({
                    request: async () => {
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
                    options: {
                        hideSuccessNotification: false,
                        successNotificationDescription: 'Utworzono nowego użytkownika.',
                        errorNotificationTitle: 'Błąd',
                        errorNotificationDescription: 'Nie udało się utworzyć użytkownika. Spróbuj ponownie.',
                    },
                });
            } finally {
                this.isSaving = false;
            }
        },
        async updateUser(payload: UserFormData): Promise<User> {
            const usersStore = useUsersStore();
            const user = this.user;

            this.isSaving = true;

            try {
                return await wrapRequestTryCatch({
                    request: async () => {
                        if (!user) {
                            throw new Error('Brak użytkownika do edycji.');
                        }

                        const currentUser = usersStore.users.find((item) => item.id === user.id);

                        if (!currentUser) {
                            throw new Error('Nie znaleziono użytkownika do aktualizacji.');
                        }

                        const response = await usersActionsApi.updateUser(payload);

                        const updatedUser: User = {
                            ...currentUser,
                            ...response,
                        };

                        const userIndex = usersStore.users.findIndex((item) => item.id === user.id);

                        if (userIndex === -1) {
                            throw new Error('Nie znaleziono użytkownika do aktualizacji.');
                        }

                        usersStore.users[userIndex] = updatedUser;

                        return updatedUser;
                    },
                    options: {
                        hideSuccessNotification: false,
                        successNotificationDescription: 'Zaktualizowano dane użytkownika.',
                        errorNotificationTitle: 'Błąd',
                        errorNotificationDescription: 'Nie udało się zaktualizować użytkownika. Spróbuj ponownie.',
                    },
                });
            } finally {
                this.isSaving = false;
            }
        },
        async deleteUser(userId: number): Promise<void> {
            const usersStore = useUsersStore();

            this.isSaving = true;

            try {
                await wrapRequestTryCatch({
                    request: async () => {
                        const userIndex = usersStore.users.findIndex((user) => user.id === userId);

                        if (userIndex === -1) {
                            throw new Error('Nie znaleziono użytkownika do usunięcia.');
                        }

                        await usersActionsApi.deleteUser(userId);

                        usersStore.users.splice(userIndex, 1);
                    },
                    options: {
                        hideSuccessNotification: false,
                        successNotificationDescription: 'Usunięto użytkownika.',
                        errorNotificationTitle: 'Błąd',
                        errorNotificationDescription: 'Nie udało się usunąć użytkownika. Spróbuj ponownie.',
                    },
                });
            } finally {
                this.isSaving = false;
            }
        },
    },
});
