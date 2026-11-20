<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-semibold">Użytkownicy</h1>

            <p class="text-sm text-surface-500">Zarządzaj użytkownikami, ich uprawnieniami i dostępem do systemu.</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
                v-for="statistic in usersStatistics"
                :key="statistic.label"
                class="flex flex-col gap-2 rounded-xl border border-surface-200 bg-surface-0 p-4 dark:border-surface-700 dark:bg-surface-900"
            >
                <span class="text-sm text-surface-500">
                    {{ statistic.label }}
                </span>

                <span class="text-2xl font-semibold">
                    {{ statistic.value }}
                </span>
            </div>
        </div>
        <BaseTable
            :data="users"
            :value="users"
            :columns="columns"
            :loading="isLoading"
            data-key="id"
            @edit="handleEdit"
            @delete="handleDelete"
        >
            <template #permission="{ data }">
                <Tag :value="userPermissionConfig[data.permission].label" severity="info" />
            </template>
            <template #status="{ data }">
                <Tag :value="userStatusConfig[data.status].label" :severity="userStatusConfig[data.status].severity" />
            </template>
            <template #expansion="{ data }">
                <div class="flex flex-col gap-5 p-4">
                    <!-- User information -->
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="text-base font-semibold">{{ data.firstName }} {{ data.lastName }}</h3>

                            <Tag :value="userStatusConfig[data.status].label" :severity="userStatusConfig[data.status].severity" />
                        </div>

                        <p class="max-w-3xl text-sm leading-relaxed text-surface-500">
                            {{ data.details.bio }}
                        </p>
                    </div>
                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Dział </span>

                            <span class="text-sm font-medium">
                                {{ data.details.department }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Lokalizacja </span>

                            <span class="text-sm font-medium">
                                {{ data.details.location }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Data dołączenia </span>

                            <span class="text-sm font-medium">
                                {{ formatDate(data.details.joinedAt) }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Ostatnie logowanie </span>

                            <span class="text-sm font-medium">
                                {{ formatDateTime(data.details.lastLogin) }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Telefon </span>

                            <span class="text-sm font-medium">
                                {{ data.details.phone }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Uprawnienia </span>

                            <span class="text-sm font-medium">
                                {{ userPermissionConfig[data.permission].label }}
                            </span>

                            <span class="text-xs text-surface-500">
                                {{ userPermissionConfig[data.permission].description }}
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3">
                        <span class="text-xs font-medium uppercase tracking-wide text-surface-500"> Umiejętności </span>

                        <div class="flex flex-wrap gap-2">
                            <Tag
                                v-for="skill in data.details.skills"
                                :key="skill"
                                :value="skill"
                                severity="secondary"
                                class="!font-normal"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </BaseTable>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { format, parseISO } from 'date-fns';
    import { pl } from 'date-fns/locale';
    import Tag from 'primevue/tag';
    import BaseTable from '@/components/base/BaseTable.vue';
    import type { BaseTableColumn } from '@/components/base/types/baseTableType.ts';
    import { useUsersStore } from '@/modules/users/stores/usersStore.ts';
    import { userPermissionConfig, userStatusConfig } from '@/modules/users/constants/userConfig.ts';
    import type { User } from '@/modules/users/types/userType.ts';

    const usersStore = useUsersStore();

    const users = computed(() => usersStore.users);
    const isLoading = computed(() => usersStore.isLoading);

    const columns: BaseTableColumn<User>[] = [
        {
            field: 'id',
            header: '',
            checked: true,
            isExpander: true,
            width: '3rem',
        },
        {
            field: 'firstName',
            header: 'Imię',
            sortable: true,
            checked: true,
        },
        {
            field: 'lastName',
            header: 'Nazwisko',
            sortable: true,
            checked: true,
        },
        {
            field: 'position',
            header: 'Stanowisko',
            sortable: true,
            checked: true,
        },
        {
            field: 'email',
            header: 'Adres e-mail',
            sortable: true,
            checked: true,
        },
        {
            field: 'permission',
            header: 'Uprawnienia',
            sortable: true,
            checked: true,
            slotName: 'permission',
        },
        {
            field: 'status',
            header: 'Status',
            sortable: true,
            checked: true,
            slotName: 'status',
        },
    ];

    const usersStatistics = computed(() => [
        {
            label: 'Wszyscy użytkownicy',
            value: usersStore.usersCount,
        },
        {
            label: 'Aktywni',
            value: usersStore.activeUsers.length,
        },
        {
            label: 'Oczekujący',
            value: usersStore.pendingUsers.length,
        },
        {
            label: 'Nieaktywni',
            value: usersStore.inactiveUsers.length,
        },
    ]);

    function formatDate(value: string): string {
        return format(parseISO(value), 'dd MMMM yyyy', {
            locale: pl,
        });
    }

    function formatDateTime(value: string): string {
        return format(parseISO(value), 'dd MMMM yyyy, HH:mm', {
            locale: pl,
        });
    }

    function handleEdit(user: User): void {
        console.log('Edit user:', user);
    }

    function handleDelete(user: User): void {
        console.log('Delete user:', user);
    }

    onMounted(() => {
        usersStore.getUsersList();
    });
</script>
