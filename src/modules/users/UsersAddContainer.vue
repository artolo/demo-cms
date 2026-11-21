<template>
    <div>
        <Button label="Dodaj użytkownika" icon="pi pi-plus" severity="primary" @click="openDialog" />

        <Dialog
            v-model:visible="isDialogVisible"
            modal
            header="Dodaj użytkownika"
            :style="{ width: 'min(95vw, 38rem)' }"
            closable
            :draggable="false"
        >
            <UserAddForm v-if="isDialogVisible" class="p-2" @submit="handleSubmit" @cancel="closeDialog" />
        </Dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Button from 'primevue/button';
    import Dialog from 'primevue/dialog';
    import UserAddForm from '@/modules/users/components/UserAddForm.vue';
    import { useUsersActionsStore } from '@/modules/users/stores/usersActionsStore.ts';
    import type { UserFormData } from '@/modules/users/types/userType';

    const usersActionsStore = useUsersActionsStore();
    const isDialogVisible = ref<boolean>(false);

    function openDialog(): void {
        isDialogVisible.value = true;
    }

    function closeDialog(): void {
        isDialogVisible.value = false;
    }

    async function handleSubmit(payload: UserFormData): Promise<void> {
        const newUser = await usersActionsStore.addUser(payload);
        console.log('Created user:', newUser);
        closeDialog();
    }
</script>
