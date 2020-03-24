import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

import { Button, Card, Form, FormItem, Input, Loading, Message} from 'element-ui';
// import 'normalize.css'

Vue.prototype.$ELEMENT = {  zIndex: 3000 };
Vue.use(Button)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Loading)

Vue.prototype.$message = Message;


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
