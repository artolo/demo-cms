<template>
    <Toast position="bottom-right" />
</template>

<script setup lang="ts">
    import { watch } from 'vue';
    import Toast from 'primevue/toast';
    import { useToast } from 'primevue/usetoast';
    import { useNotificationStore } from '@/stores/notificationStore';

    const notificationStore = useNotificationStore();
    const toast = useToast();

    watch(
        () => notificationStore.notificationsList.length,
        () => {
            const notifications = notificationStore.consumeNotifications();

            notifications.forEach((notification) => {
                toast.add({
                    summary: notification.summary,
                    detail: notification.detail ?? '',
                    severity: notification.severity,
                    life: notification.timeout ?? 3000,
                });
            });
        },
    );
</script>
