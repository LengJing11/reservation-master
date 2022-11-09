import Vue from 'vue';
import Vuex from 'vuex';
// 本项目未用到 vuex

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    AccountInfo: {}, // 当前用户的账户信息
  },
  mutations: {
    setAccountInfo(state, val) { // 设置账户信息
      state.AccountInfo = val;
    },
  },
  actions: {
    async getAccountInfo(context) {
      const data = {
        username: 'admin',
        password: 'j123456',
        rolename: 'admin',
      };
      context.commit('setAccountInfo', data);
    },
  },
});
