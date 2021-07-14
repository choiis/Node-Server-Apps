import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Main from '@/components/main'
import plTLists from '@/components/plTLists'
import files from '@/components/files'
import notfound from '@/components/404'
import chattingTotalRanks from '@/components/chattingTotalRanks'
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
            component: Main,
            beforeEnter: (to, from, next) => {
                console.log("main from : " + from.path + " to : " + to.path);
                next();
            },
            children: [{
                    path: '/plTLists',
                    name: 'plTLists',
                    component: plTLists
                },
                {
                    path: '/files',
                    name: 'files',
                    component: files
                },
                {
                    path: '/chattingTotalRanks',
                    name: 'chattingTotalRanks',
                    component: chattingTotalRanks
                }
            ]
        },
        { path: '*', component: notfound }
    ]
});

router.beforeEach((to, from, next) => {
    console.log("before each to : " + to.path + " from : " + from.path);
    next();
});