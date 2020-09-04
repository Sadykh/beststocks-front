import Vue from 'vue'
import Router from 'vue-router'
import EmptyLayout from './components/layouts/EmptyLayout'
import MainLayout from './components/layouts/MainLayout'
import View from './views/View'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '',
            meta: {
                title: "Главная",
            },
            component: EmptyLayout,
            children: [
                {
                    path: '',
                    name: 'MainIndex',
                    meta: {
                        title: "Главная",
                    },
                    component: MainLayout,
                },
                {
                    path: '/view/:id',
                    name: 'View',
                    component: View,
                    meta: {
                        title: "Просмотр новости",
                    },
                },
            ]
        },

    ]
})
