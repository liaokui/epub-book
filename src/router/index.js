import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('../views/login/login.vue');
const List = () => import('../views/list/list.vue');
const Detail = () => import('../views/detail/detail.vue');
const Error = () => import('../views/error/error');


Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: ['登录'],
      },
    },
    {
      path: '/list',
      name: 'list',
      component: List,
      meta: {
        title: ['书籍列表'],
      },
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail,
      meta: {
        title: ['书籍详情'],
      },
    },
    {
      path: '**',
      name: 'error',
      component: Error,
      meta: {
        title: ['错误'],
      },
    }
  ]
})

