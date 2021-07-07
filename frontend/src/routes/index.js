import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Main from '@/components/main'
Vue.use(Router)

export const router = new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/main',
            name: 'Main',
            component: Main
        }
    ]
})