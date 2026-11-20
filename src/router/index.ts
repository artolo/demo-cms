import { createRouter, createWebHistory } from 'vue-router';

import pinia from '@/stores';
import { useAuthStore } from '@/modules/auth/stores/authStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/modules/auth/authContainer.vue'),
            meta: {
                guestOnly: true,
            },
        },
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/modules/dashboard/dashboardContainer.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/modules/users/usersContainer.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore(pinia);

    authStore.restoreSession();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login' };
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return { name: 'dashboard' };
    }

    return true;
});

export default router;
