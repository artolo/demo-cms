import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './modules/auth/stores/authStore';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);
const pinia = createPinia();
app.directive('tooltip', Tooltip);
app.use(pinia);
app.use(ToastService);

const authStore = useAuthStore(pinia);
authStore.restoreSession();

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.app-dark',
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue',
            },
        },
    },
});

app.use(router);
app.mount('#app');
