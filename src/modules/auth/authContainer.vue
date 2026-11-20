<template>
    <main class="min-h-screen flex items-center justify-center bg-surface-100 p-4">
        <div class="w-full max-w-md">
            <Card>
                <template #title>
                    <div class="text-center">
                        <h1 class="text-2xl font-bold">Demo CMS</h1>
                        <p class="mt-2 text-sm font-normal text-muted-color">Zaloguj się do swojego konta</p>
                    </div>
                </template>
                <template #content>
                    <AuthForm :loading="loading" :error="error" @submit="handleLogin" />
                </template>
            </Card>
            <p class="mt-5 text-center text-xs text-muted-color">Demo CMS © 2026</p>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import Card from 'primevue/card';
    import AuthForm from './components/AuthForm.vue';
    import { useAuthStore } from './stores/authStore';
    import type { LoginCredentials } from './types/authTypes';

    const router = useRouter();
    const authStore = useAuthStore();

    const loading = ref(false);
    const error = ref<string | null>(null);

    async function handleLogin(credentials: LoginCredentials) {
        loading.value = true;
        error.value = null;

        try {
            await authStore.login(credentials);

            await router.replace({ name: 'dashboard' });
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd.';
        } finally {
            loading.value = false;
        }
    }
</script>
