import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
//import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { fakeBackend } from '@/utils/helpers/fake-backend';
import 'vue3-carousel/dist/carousel.css';
//import './_mockApis';
import Maska from 'maska';
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';
import VueScrollTo from 'vue-scrollto';
import VueEasyLightbox from 'vue-easy-lightbox';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
//import VueGoogleMaps from '@fawmi/vue-google-maps';

const i18n = createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

const app = createApp(App);

fakeBackend();

app.use(router);
app.use(PerfectScrollbar);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(i18n);
app.use(Maska);
app.use(vuetify);
app.use(VueScrollTo, {
    duration: 1000,
    easing: 'ease'
});
app.use(VueEasyLightbox);
app.use(Toast);

app.mount('#app');
