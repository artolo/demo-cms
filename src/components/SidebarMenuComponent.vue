<template>
    <aside
        class="sticky top-0 flex h-screen w-20 shrink-0 flex-col border-r border-surface-200 bg-white transition-[width] duration-200 lg:w-[250px]"
    >
        <div class="flex h-20 items-center justify-center border-b border-surface-200 px-4 lg:justify-start">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <i class="pi pi-box text-xl" />
            </div>
            <span class="ml-3 hidden text-xl font-bold tracking-tight text-surface-900 lg:block"> Demo CMS </span>
        </div>
        <nav class="flex-1 px-3 py-6">
            <div class="flex flex-col gap-1">
                <RouterLink
                    v-for="item in menuItems"
                    :key="item.name"
                    :to="{ name: item.name }"
                    :active-class="activeMenuItemClass"
                    :class="menuItemClass"
                    :title="item.label"
                >
                    <i :class="item.icon" />
                    <span class="hidden lg:block">
                        {{ item.label }}
                    </span>
                </RouterLink>
            </div>
        </nav>
        <div class="border-t border-surface-200 p-3">
            <div class="mb-3 hidden items-center gap-3 px-2 py-2 lg:flex">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-100 text-surface-600">
                    <i class="pi pi-user" />
                </div>
                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-surface-800">
                        {{ fullName }}
                    </p>

                    <p class="truncate text-xs text-surface-500">
                        {{ authStore.user?.email }}
                    </p>
                </div>
            </div>
            <button type="button" :class="logoutButtonClass" @click="handleLogout">
                <i class="pi pi-sign-out text-lg" />
                <span class="hidden lg:block"> Wyloguj się </span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/modules/auth/stores/authStore';

    interface MenuItem {
        name: string;
        label: string;
        icon: string;
    }

    const router = useRouter();
    const authStore = useAuthStore();

    const menuItems: MenuItem[] = [
        {
            name: 'dashboard',
            label: 'Pulpit',
            icon: 'pi pi-home text-lg',
        },
        {
            name: 'users',
            label: 'Użytkownicy',
            icon: 'pi pi-users text-lg',
        },
    ];

    const menuItemClass =
        'flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-surface-600 transition-colors ' +
        'hover:bg-surface-100 hover:text-surface-900 lg:justify-start';

    const activeMenuItemClass = 'bg-blue-50 text-blue-700';

    const logoutButtonClass =
        'flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-surface-600 transition-colors ' +
        'hover:bg-red-50 hover:text-red-600 lg:justify-start';

    const fullName = computed(() => {
        const { firstName, lastName } = authStore.user ?? {};

        return [firstName, lastName].filter(Boolean).join(' ');
    });

    function handleLogout() {
        authStore.logout();
        router.replace({ name: 'login' });
    }
</script>
