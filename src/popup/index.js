import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './popup.vue'
import Register from './register.vue'
import Storage from './storage.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register },
    { path: '/storage', component: Storage }
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
