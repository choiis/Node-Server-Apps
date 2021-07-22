import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Main from '@/components/main'
import plTLists from '@/components/plTLists'
import files from '@/components/files'
import notfound from '@/components/404'
import chattingTotalRanks from '@/components/chattingTotalRanks'
import LoginInfo from '@/components/logininfo'
import DailyInfo from '@/components/dailyinfo'
Vue.use(Router);
Vue.component('login-component', LoginInfo);
Vue.component('daily-component', DailyInfo);

import axios from 'axios';

function authCheck(to, from, next) {
    console.log("before each to : " + to.path + " from : " + from.path);
    axios.get('/api/session')
        .then(() => {
            next();
        })
        .catch(() => {
            next({ name: 'Index' });
        });

}

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
            beforeEnter: authCheck,
            children: [{
                    path: '/plTLists',
                    name: 'plTLists',
                    component: plTLists,
                    beforeEnter: authCheck
                },
                {
                    path: '/files',
                    name: 'files',
                    component: files,
                    beforeEnter: authCheck
                },
                {
                    path: '/chattingTotalRanks',
                    name: 'chattingTotalRanks',
                    component: chattingTotalRanks,
                    beforeEnter: authCheck
                }
            ]
        },
        { path: '*', component: notfound }
    ]
});