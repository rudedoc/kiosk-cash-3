import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice'; 
import { createPinia } from 'pinia';

import 'primeicons/primeicons.css';      
import 'primeflex/primeflex.css';  


const app = createApp(App);
const pinia = createPinia(); 

app.use(pinia); 
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none',
        }
    }
});

app.use(ToastService);

app.mount('#app');