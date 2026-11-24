<template>
    <Dialog
        :visible="showDialog"
        modal
        :header="dialogTitle"
        :style="{ width: 'min(95vw, 38rem)' }"
        closable
        :draggable="false"
        @update:visible="handleVisibilityChange"
    >
        <UserForm
            v-if="showDialog"
            class="p-2"
            :is-editing="isUserEditing"
            @submit="handleSubmit"
            @cancel="closeDialog"
        />
    </Dialog>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import Dialog from 'primevue/dialog';
    import UserForm from '@/modules/users/components/UserForm.vue';
    import { useUsersActionsStore } from '@/modules/users/stores/usersActionsStore.ts';
    import type { UserFormData } from '@/modules/users/types/userType';

    defineProps<{
        showDialog: boolean;
    }>();

    const emit = defineEmits<{
        close: [];
    }>();

    const usersActionsStore = useUsersActionsStore();

    const isUserEditing = computed(() => usersActionsStore.user !== null);
    const dialogTitle = computed(() => (isUserEditing.value ? 'Edytuj użytkownika' : 'Dodaj użytkownika'));

    function closeDialog(): void {
        usersActionsStore.user = null;
        emit('close');
    }

    function handleVisibilityChange(visible: boolean): void {
        if (!visible) {
            closeDialog();
        }
    }

    async function handleSubmit(payload: UserFormData): Promise<void> {
        if (isUserEditing.value) {
            await usersActionsStore.updateUser(payload);
        } else {
            await usersActionsStore.addUser(payload);
        }

        closeDialog();
    }
</script>
