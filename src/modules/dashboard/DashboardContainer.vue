<template>
    <main class="min-h-screen p-8">
        <div class="mx-auto max-w-5xl">
            <Card>
                <template #title> Dashboard </template>
                <template #content>
                    <div class="flex flex-col gap-4">
                        <p>
                            Witaj,
                            <strong>
                                {{ authStore.user?.firstName }}
                                {{ authStore.user?.lastName }}
                            </strong>
                        </p>

                        <p class="text-muted-color">Twoja rola: {{ authStore.user?.role }}</p>
                    </div>
                </template>
            </Card>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/modules/auth/stores/authStore';
    import Card from 'primevue/card';

    const authStore = useAuthStore();
</script>
