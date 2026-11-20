<template>
    <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-2">
            <label for="email" class="font-medium text-sm"> Adres e-mail </label>
            <InputText
                id="email"
                v-model="email"
                type="email"
                placeholder="Wpisz adres e-mail"
                autocomplete="username"
                class="w-full"
                required
            />
        </div>
        <div class="flex flex-col gap-2">
            <label for="password" class="font-medium text-sm"> Hasło </label>
            <Password
                v-model="password"
                input-id="password"
                placeholder="Wpisz hasło"
                :feedback="false"
                toggle-mask
                fluid
                autocomplete="current-password"
                required
            />
        </div>
        <Message v-if="error" severity="error" :closable="false">
            {{ error }}
        </Message>
        <Button type="submit" label="Zaloguj się" icon="pi pi-sign-in" :loading="loading" :disabled="isSubmitDisabled" class="w-full" />
    </form>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Password from 'primevue/password';
    import Message from 'primevue/message';
    import type { LoginCredentials } from '../types/authType';
    import { DEFAULT_USER_LOGIN } from '@/constants.ts';

    const props = defineProps<{
        loading: boolean;
        error: string | null;
    }>();

    const emit = defineEmits<{
        submit: [credentials: LoginCredentials];
    }>();

    const email = ref(DEFAULT_USER_LOGIN);
    const password = ref('');

    const isSubmitDisabled = computed(() => {
        return props.loading || !email.value.trim() || !password.value;
    });

    function handleSubmit() {
        emit('submit', {
            email: email.value.trim(),
            password: password.value,
        });
    }
</script>
