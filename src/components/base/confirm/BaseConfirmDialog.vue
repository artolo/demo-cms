<template>
    <Dialog
        :visible="visible"
        modal
        :header="title"
        :style="{ width: 'min(28rem, calc(100vw - 2rem))' }"
        :closable="!loading"
        :dismissable-mask="!loading"
        :close-on-escape="!loading"
        @update:visible="handleVisibilityChange"
    >
        <div class="flex flex-col gap-2">
            <p class="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                {{ message }}
            </p>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Anuluj" severity="secondary" variant="outlined" :disabled="loading" @click="handleCancel" />

                <Button :label="confirmLabel" severity="danger" :loading="loading" :disabled="loading" @click="emit('confirm')" />
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    import Dialog from 'primevue/dialog';
    import Button from 'primevue/button';

    interface Props {
        visible: boolean;
        title?: string;
        message: string;
        confirmLabel?: string;
        loading?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        title: 'Potwierdzenie',
        confirmLabel: 'Potwierdź',
        loading: false,
    });

    const emit = defineEmits<{
        'update:visible': [value: boolean];
        confirm: [];
    }>();

    function handleVisibilityChange(value: boolean): void {
        emit('update:visible', value);
    }

    function handleCancel(): void {
        emit('update:visible', false);
    }
</script>
