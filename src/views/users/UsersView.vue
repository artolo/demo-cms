<template>
    <TemplateWrapper :items="items">
        <template #actions>
            <div class="flex flex-row">
                <!--    @todo: Akcja dodania użytkownika - do zrobienia   -->
                DODAJ
            </div>
        </template>
        <template #default>
            <UsersContainer />
            <pre>{{ isAdmin }}</pre>
        </template>
    </TemplateWrapper>
</template>

<script setup lang="ts">
    import TemplateWrapper from '@/components/templateWrapper/TemplateWrapper.vue';
    import { computed, ref } from 'vue';
    import { useAuthStore } from '@/modules/auth/stores/authStore.ts';
    import type { BreadcrumbItem } from '@/types/breadcrumbItemType.ts';
    import UsersContainer from '@/modules/users/UsersContainer.vue';
    import { UserRole } from '@/constants.ts';

    const authStore = useAuthStore();
    const isAdmin = computed<boolean>(() => authStore.user?.role === UserRole.SUPER_ADMIN || authStore.user?.role === UserRole.ADMIN);

    const items = ref<BreadcrumbItem[]>([{ label: 'Użytkownicy', route: '/users' }]);
</script>
