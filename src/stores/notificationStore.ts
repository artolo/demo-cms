import { defineStore, acceptHMRUpdate } from 'pinia';

import type { NotificationModel } from '@/types/notificationTypes';

interface NotificationState {
    notificationsList: NotificationModel[];
}

export const useNotificationStore = defineStore('notification', {
    state: (): NotificationState => ({
        notificationsList: [],
    }),

    getters: {
        getNotificationsList: (state): NotificationModel[] => state.notificationsList,
    },

    actions: {
        addNotification(notification: NotificationModel): void {
            this.notificationsList.push(notification);
        },

        consumeNotifications(): NotificationModel[] {
            return this.notificationsList.splice(0, this.notificationsList.length);
        },

        clearNotifications(): void {
            this.notificationsList = [];
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot));
}
