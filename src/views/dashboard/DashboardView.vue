<template>
    <TemplateWrapper :items="items">
        <template #default>
            <DashboardContainer />
        </template>
    </TemplateWrapper>
</template>

<script setup lang="ts">
    import TemplateWrapper from '@/components/templateWrapper/TemplateWrapper.vue';
    import { ref } from 'vue';
    import type { BreadcrumbItem } from '@/types/breadcrumbItemType.ts';
    import DashboardContainer from '@/modules/dashboard/DashboardContainer.vue';

    const items = ref<BreadcrumbItem[]>([{ label: 'Pulpit', route: '/dashboard' }]);
</script>
