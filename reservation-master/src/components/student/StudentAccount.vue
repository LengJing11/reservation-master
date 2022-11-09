<template>
  <Account url="student" :AccountInfo="AccountInfo" :getAccountInfo="getAccountInfo"
           right="修改学员账户信息"/>
</template>

<script>
// eslint-disable-next-line import/extensions
import Account from '../custom/Account';
import axios from '../../api/axios';

export default {
  name: 'StudentAccount',
  components: { Account },
  data() {
    return {
      AccountInfo: {},
    };
  },
  methods: {
    // 获取用户账户信息
    getAccountInfo() {
      axios.sendRequest({ url: '/user/detail' })
        .then(({ data }) => {
          this.AccountInfo = data;
        });
    },
  },
  async mounted() {
    this.getAccountInfo();
  },
};
</script>
