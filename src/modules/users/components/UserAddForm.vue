<template>
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
                <label for="firstName">Imię *</label>
                <InputText id="firstName" v-model="form.firstName" placeholder="Wprowadź imię" :invalid="!!errors.firstName" />
                <small v-if="errors.firstName" class="text-red-500">
                    {{ errors.firstName }}
                </small>
            </div>

            <div class="flex flex-col gap-2">
                <label for="lastName">Nazwisko *</label>
                <InputText id="lastName" v-model="form.lastName" placeholder="Wprowadź nazwisko" :invalid="!!errors.lastName" />
                <small v-if="errors.lastName" class="text-red-500">
                    {{ errors.lastName }}
                </small>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <label for="position">Stanowisko *</label>
            <InputText id="position" v-model="form.position" placeholder="Np. Frontend Developer" :invalid="!!errors.position" />
            <small v-if="errors.position" class="text-red-500">
                {{ errors.position }}
            </small>
        </div>

        <div class="flex flex-col gap-2">
            <label for="email">Adres e-mail *</label>
            <InputText id="email" v-model="form.email" placeholder="jan.kowalski@example.com" :invalid="!!errors.email" />
            <small v-if="errors.email" class="text-red-500">
                {{ errors.email }}
            </small>
        </div>

        <div class="flex flex-col gap-2">
            <label for="phone">Numer telefonu</label>
            <InputText id="phone" v-model="form.phone" placeholder="+48 500 000 000" />
        </div>

        <div class="flex flex-col gap-2">
            <label for="permission">Uprawnienia *</label>
            <Select
                id="permission"
                v-model="form.permission"
                :options="permissionOptions"
                option-label="label"
                option-value="value"
                placeholder="Wybierz uprawnienia"
                :invalid="!!errors.permission"
            />
            <small v-if="errors.permission" class="text-red-500">
                {{ errors.permission }}
            </small>
        </div>

        <div class="flex justify-between gap-2 pt-4 border-t border-surface-200">
            <Button label="Anuluj" severity="secondary" outlined type="button" @click="emit('cancel')" />

            <Button label="Dodaj użytkownika" icon="pi pi-plus" type="submit" :disabled="usersActionsStore.isSaving" />
        </div>
    </form>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import * as yup from 'yup';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Select from 'primevue/select';
    import type { User, UserFormData } from '@/modules/users/types/userType';
    import { UserRole } from '@/constants.ts';
    import { useUsersActionsStore } from '@/modules/users/stores/usersActionsStore.ts';

    const emit = defineEmits<{
        submit: [payload: UserFormData];
        cancel: [];
    }>();

    const permissionOptions: {
        label: string;
        value: User['permission'];
    }[] = [
        { label: 'Administrator systemu', value: UserRole.SUPER_ADMIN },
        { label: 'Administrator', value: UserRole.ADMIN },
        { label: 'Manager', value: UserRole.MANAGER },
        { label: 'Edytor', value: UserRole.EDITOR },
        { label: 'Użytkownik', value: UserRole.USER },
    ];

    const form = reactive({
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        permission: null as User['permission'] | null,
    });

    const errors = ref<Record<string, string>>({});
    const usersActionsStore = useUsersActionsStore();

    const schema = yup.object({
        firstName: yup.string().trim().required('Imię jest wymagane.'),
        lastName: yup.string().trim().required('Nazwisko jest wymagane.'),
        position: yup.string().trim().required('Stanowisko jest wymagane.'),
        email: yup.string().trim().email('Nieprawidłowy adres e-mail.').required('Adres e-mail jest wymagany.'),
        phone: yup.string().default(''),
        permission: yup
            .mixed<User['permission']>()
            .oneOf(['super_admin', 'admin', 'manager', 'editor', 'user'])
            .required('Wybór uprawnień jest wymagany.'),
    });

    function setValidationErrors(error: yup.ValidationError): void {
        errors.value = {};

        error.inner.forEach(({ path, message }) => {
            if (path) {
                errors.value[path] = message;
            }
        });
    }

    async function handleSubmit(): Promise<void> {
        errors.value = {};

        try {
            const values = await schema.validate(form, {
                abortEarly: false,
                stripUnknown: true,
            });

            emit('submit', values as UserFormData);
        } catch (error: unknown) {
            if (error instanceof yup.ValidationError) {
                setValidationErrors(error);
                return;
            }

            throw error;
        }
    }
</script>
