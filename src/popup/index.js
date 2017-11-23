import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './popup.vue'
import Login from './login.vue'
import Register from './register.vue'

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register }
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
