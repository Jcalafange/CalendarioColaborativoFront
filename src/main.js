import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

const app = createApp(App);
app.use(vuetify); // Register Vuetify
app.mount('#app');
