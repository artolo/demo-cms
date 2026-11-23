<template>
    <TemplateWrapper :items="items">
        <template #actions>
            <div v-if="isAdmin" class="flex flex-row">
                <Button label="Dodaj użytkownika" icon="pi pi-plus" severity="primary" @click="openDialog" />

                <UsersAddOrEditContainer :show-dialog="showDialog" @close="closeDialog" />
            </div>
        </template>

        <template #default>
            <UsersContainer @edit="editUser" />
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
    import UsersAddOrEditContainer from '@/modules/users/UsersAddOrEditContainer.vue';
    import Button from 'primevue/button';

    const authStore = useAuthStore();

    const showDialog = ref(false);
    const items = ref<BreadcrumbItem[]>([{ label: 'Użytkownicy', route: '/users' }]);

    const isAdmin = computed<boolean>(() => authStore.user?.role === UserRole.SUPER_ADMIN || authStore.user?.role === UserRole.ADMIN);

    function editUser(): void {
        showDialog.value = true;
    }

    function openDialog(): void {
        showDialog.value = true;
    }

    function closeDialog(): void {
        showDialog.value = false;
    }
</script>
