<template>
    <div>
        <div class="flex border-b border-surface-200">
            <Breadcrumb v-if="items.length" class="bg-gray-50 text-sm" :home="home" :model="items">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a
                            :href="href"
                            v-bind="props.action"
                            class="text-black-alpha-40 hover:text-red-400 cursor-pointer"
                            @click="navigate"
                        >
                            <span :class="[item.icon, 'text-color']" />
                            <p class="text-black-alpha-40 hover:text-red-400 cursor-pointer">
                                {{ item.label }}
                            </p>
                        </a>
                    </router-link>
                    <a v-else :href="item.url" v-bind="props.action" class="text-black-alpha-40 hover:text-red-400 cursor-pointer">
                        <span>{{ item.label }}</span>
                    </a>
                </template>
            </Breadcrumb>
            <div class="ml-auto mt-4 mr-3">
                <slot name="actions" />
            </div>
        </div>

        <div class="p-3">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import Breadcrumb from 'primevue/breadcrumb';
    import { ref } from 'vue';
    import type { ItemBreadcrumb } from './type/templateWrapperType';

    defineProps<{
        items: ItemBreadcrumb[];
    }>();

    const home = ref<ItemBreadcrumb>({
        icon: 'pi pi-home',
        route: '/',
    });
</script>
