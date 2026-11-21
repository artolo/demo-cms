import { createRouter, createWebHistory } from 'vue-router';

import pinia from '@/stores';
import { useAuthStore } from '@/modules/auth/stores/authStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/AuthView.vue'),
            meta: {
                guestOnly: true,
            },
        },
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/dashboard/DashboardView.vue'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/users/UsersView.vue'),
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
