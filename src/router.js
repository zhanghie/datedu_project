// import Vue from 'vue'
// import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import Header from './components/Header.vue'
import Index from './components/index/Index.vue'



// Vue.use(Router)

export default ({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        }, {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/header',
            name: 'Header',
            component: Header
        },
        {
            path: '/index',
            name: 'Index',
            component: Index
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                // component: () =>
                //     import ( /* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})