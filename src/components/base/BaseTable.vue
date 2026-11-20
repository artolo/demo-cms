<template>
    <div class="base-table relative w-full min-w-0">
        <DataTable
            v-model:filters="filters"
            v-model:expanded-rows="expandedRows"
            :value="props.data"
            :loading="props.isLoading"
            :global-filter-fields="resolvedGlobalFilterFields"
            :paginator="props.showPaginator"
            :rows="props.itemPerPage"
            :rows-per-page-options="props.rowsPerPageOptions"
            :class="['base-table-content shadow-sm', props.tableClass]"
            data-key="id"
            striped-rows
            removable-sort
            :reorderable-rows="props.showRowReorder"
            table-style="min-width: 50rem"
            @row-reorder="onRowReorder"
        >
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <InputText
                            v-if="props.showSearch"
                            v-model="filters.global.value"
                            placeholder="Wyszukaj..."
                            class="w-full sm:w-64"
                            size="small"
                        />

                        <slot name="filter" />
                    </div>

                    <div class="flex items-center gap-2 ml-auto">
                        <template v-if="hasExpander">
                            <Button label="Rozwiń wszystko" severity="secondary" size="small" text @click="expandAll" />

                            <Button label="Zwiń wszystko" severity="secondary" size="small" text @click="collapseAll" />
                        </template>

                        <div v-if="props.showColumnSettings">
                            <Button
                                v-tooltip.bottom="'Edytuj kolumny'"
                                icon="pi pi-table"
                                severity="secondary"
                                text
                                rounded
                                @click="toggleColumnSettings"
                            />

                            <Popover ref="columnPopover">
                                <div class="w-72">
                                    <h3 class="font-semibold text-sm mb-3">Edytuj kolumny</h3>

                                    <div class="flex flex-col gap-1">
                                        <div
                                            v-for="(column, index) in selectedColumns"
                                            :key="column.field"
                                            class="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-surface-100"
                                        >
                                            <div class="flex items-center gap-2 min-w-0">
                                                <Checkbox
                                                    :model-value="column.checked"
                                                    binary
                                                    :disabled="column.disabled"
                                                    @update:model-value="toggleColumn(column)"
                                                />

                                                <span class="text-sm truncate">
                                                    {{ column.header }}
                                                </span>
                                            </div>

                                            <div class="flex items-center shrink-0">
                                                <Button
                                                    icon="pi pi-angle-up"
                                                    severity="secondary"
                                                    text
                                                    rounded
                                                    size="small"
                                                    :disabled="index === 0"
                                                    @click="moveColumn(index, -1)"
                                                />

                                                <Button
                                                    icon="pi pi-angle-down"
                                                    severity="secondary"
                                                    text
                                                    rounded
                                                    size="small"
                                                    :disabled="index === selectedColumns.length - 1"
                                                    @click="moveColumn(index, 1)"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-2 mt-4">
                                        <Button label="Przywróć" severity="secondary" outlined size="small" @click="resetColumns" />

                                        <Button label="Zaznacz wszystko" severity="secondary" text size="small" @click="checkAllColumns" />

                                        <Button
                                            label="Odznacz wszystko"
                                            severity="secondary"
                                            text
                                            size="small"
                                            @click="uncheckAllColumns"
                                        />
                                    </div>
                                </div>
                            </Popover>
                        </div>

                        <slot name="filter-action" />
                    </div>
                </div>
            </template>

            <Column v-if="props.showRowReorder" row-reorder header-style="width: 3rem" />

            <Column v-if="hasExpander" header="Rozwiń" expander header-style="width: 3rem" />

            <template #expansion="slotProps">
                <slot name="expansion" v-bind="slotProps" />
            </template>

            <Column
                v-for="column in visibleColumns"
                :key="column.field"
                :field="column.field"
                :header="column.header"
                :sortable="column.sortable"
                :style="column.width ? { width: column.width } : undefined"
            >
                <template #body="slotProps">
                    <slot
                        v-if="column.slotName"
                        :name="column.slotName"
                        :item="slotProps.data[column.field]"
                        :data="slotProps.data"
                        :index="slotProps.index"
                    />

                    <template v-else>
                        {{ slotProps.data[column.field] }}
                    </template>
                </template>
            </Column>

            <Column v-if="props.showActions" header="Akcje" :exportable="false" header-style="width: 8rem">
                <template #body="slotProps">
                    <div class="flex items-center gap-1">
                        <slot name="action-before" :item="slotProps.data" :index="slotProps.index" />

                        <Button
                            v-if="props.showEditButton && isRowEditable(slotProps.data)"
                            v-tooltip.bottom="'Edytuj'"
                            icon="pi pi-pencil"
                            severity="secondary"
                            text
                            rounded
                            size="small"
                            @click="editRow(slotProps.data)"
                        />

                        <Button
                            v-if="props.showDeleteButton && isRowEditable(slotProps.data)"
                            v-tooltip.bottom="'Usuń'"
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            size="small"
                            @click="deleteRow(slotProps.data)"
                        />

                        <slot name="action-after" :item="slotProps.data" :index="slotProps.index" />
                    </div>
                </template>
            </Column>

            <template #empty>
                <div class="py-6 text-center text-surface-500">Brak danych do wyświetlenia</div>
            </template>

            <template #loading>
                <div class="py-6 text-center">Ładowanie danych...</div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
    import { computed, ref, watch } from 'vue';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import Popover from 'primevue/popover';
    import Checkbox from 'primevue/checkbox';
    import { FilterMatchMode } from '@primevue/core/api';
    import type { BaseTableColumn } from './types/baseTableType';

    interface Props {
        data: T[];
        columns: BaseTableColumn<T>[];
        isLoading?: boolean;
        itemPerPage?: number;
        rowsPerPageOptions?: number[];
        globalFilterFields?: string[];
        showSearch?: boolean;
        showColumnSettings?: boolean;
        showPaginator?: boolean;
        showActions?: boolean;
        showEditButton?: boolean;
        showDeleteButton?: boolean;
        showRowReorder?: boolean;
        tableClass?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        isLoading: false,
        itemPerPage: 10,
        rowsPerPageOptions: () => [5, 10, 15, 20, 50],
        showSearch: true,
        showColumnSettings: true,
        showPaginator: true,
        showActions: false,
        showEditButton: true,
        showDeleteButton: true,
        showRowReorder: false,
        tableClass: '',
    });

    const emit = defineEmits<{
        edit: [row: T];
        delete: [row: T];
        rowReorder: [rows: T[]];
    }>();

    const filters = ref({
        global: {
            value: '',
            matchMode: FilterMatchMode.CONTAINS,
        },
    });

    const expandedRows = ref<T[]>([]);
    const columnPopover = ref<InstanceType<typeof Popover> | null>(null);

    const selectedColumns = ref<BaseTableColumn<T>[]>(
        props.columns.map((column) => ({
            ...column,
            checked: column.checked ?? true,
        })),
    );

    const backupColumns = ref<BaseTableColumn<T>[]>(
        props.columns.map((column) => ({
            ...column,
            checked: column.checked ?? true,
        })),
    );

    const visibleColumns = computed(() => selectedColumns.value.filter((column) => column.checked));

    const resolvedGlobalFilterFields = computed(() => props.globalFilterFields ?? visibleColumns.value.map((column) => column.field));

    const hasExpander = computed(() => visibleColumns.value.some((column) => column.slotName === 'expander'));

    watch(
        () => props.columns,
        (columns) => {
            selectedColumns.value = columns.map((column) => ({
                ...column,
                checked: column.checked ?? true,
            }));

            backupColumns.value = columns.map((column) => ({
                ...column,
                checked: column.checked ?? true,
            }));
        },
        { deep: true },
    );

    function toggleColumnSettings(event: Event): void {
        columnPopover.value?.toggle(event);
    }

    function toggleColumn(column: BaseTableColumn<T>): void {
        if (column.disabled) return;

        column.checked = !column.checked;
    }

    function checkAllColumns(): void {
        selectedColumns.value.forEach((column) => {
            if (!column.disabled) {
                column.checked = true;
            }
        });
    }

    function uncheckAllColumns(): void {
        selectedColumns.value.forEach((column) => {
            if (!column.disabled) {
                column.checked = false;
            }
        });
    }

    function resetColumns(): void {
        selectedColumns.value = backupColumns.value.map((column) => ({
            ...column,
        }));
    }

    function moveColumn(index: number, direction: -1 | 1): void {
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= selectedColumns.value.length) {
            return;
        }

        const columns = [...selectedColumns.value];

        [columns[index], columns[targetIndex]] = [columns[targetIndex], columns[index]];

        selectedColumns.value = columns;
    }

    function editRow(row: T): void {
        emit('edit', row);
    }

    function deleteRow(row: T): void {
        emit('delete', row);
    }

    function expandAll(): void {
        expandedRows.value = [...props.data];
    }

    function collapseAll(): void {
        expandedRows.value = [];
    }

    function onRowReorder(event: { value: T[] }): void {
        emit('rowReorder', event.value);
    }

    function isRowEditable(row: T): boolean {
        return !('deleted' in row && row.deleted);
    }
</script>

<style scoped lang="scss">
    .base-table {
        :deep(.p-datatable-table-container) {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
        }

        :deep(.p-datatable-table) {
            min-width: 900px;
        }

        :deep(.p-datatable-thead > tr > th) {
            border-bottom: 1px solid var(--p-surface-200);
            font-size: 0.875rem;
            white-space: nowrap;
        }

        :deep(.p-datatable-tbody > tr > td) {
            border-bottom: 1px solid var(--p-surface-100);
            font-size: 0.875rem;
        }
    }
</style>
