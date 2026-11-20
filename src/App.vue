<template>
    <div v-if="isAuthenticatedLayout" class="flex min-h-screen bg-surface-50">
        <SidebarMenuComponent />

        <main class="min-w-0 flex-1 overflow-x-hidden">
            <RouterView />
        </main>
    </div>

    <RouterView v-else />

    <NotificationComponent />
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterView, useRoute } from 'vue-router';

    import SidebarMenuComponent from '@/components/SidebarMenuComponent.vue';
    import NotificationComponent from '@/components/NotificationComponent.vue';

    const route = useRoute();

    const isAuthenticatedLayout = computed(() => route.meta.requiresAuth === true);
</script>
