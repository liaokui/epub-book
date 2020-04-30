import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import './assets/icon/iconfont.css'

import { Message, Image, Tag, Backtop, Scrollbar, Card, Loading, Input, Form, FormItem, Progress, Upload, Button, Drawer, Select, Option} from 'element-ui';
import 'normalize.css'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

import * as filters from './utils/filters'
import { getToken } from './utils/auth'

Vue.prototype.$ELEMENT = { zIndex: 3000 };
// Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Image)
Vue.use(Tag)
Vue.use(Backtop)
Vue.use(Scrollbar)
Vue.use(Card)
Vue.use(Loading)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Progress)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Drawer)
Vue.use(Select)
Vue.use(Option)
Vue.component(CollapseTransition.name, CollapseTransition)


Vue.prototype.$message = Message;

Vue.config.productionTip = false

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
     if (getToken()) {
        next()
      } else {
        next({ path: '/login' })
      }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})