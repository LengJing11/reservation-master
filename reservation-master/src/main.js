import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 按需引入 ElementUI 组件
// eslint-disable-next-line import/extensions
import './api/element.js';
// 引入自定义插件
import MyPlugin from './plugins/plugin';
import MyBread from './components/custom/MyBread.vue';
// 添加全局自定义组件
Vue.component(MyBread.name, MyBread);

Vue.config.productionTip = false;
Vue.use(MyPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
