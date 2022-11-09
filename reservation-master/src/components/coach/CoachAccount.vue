<template>
  <div style="height: 100%">
    <Account url="coach" :AccountInfo="AccountInfo" :getAccountInfo="getAccountInfo"
             right="修改教练账户信息"/>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import Account from '../custom/Account';
import axios from '../../api/axios';

export default {
  name: 'CoachAccount',
  components: { Account },
  data() {
    return {
      AccountInfo: {},
    };
  },
  methods: {
    // 获取教练账户信息
    getAccountInfo() {
      axios.sendRequest({ url: '/user/detail' })
        .then(({ data }) => {
          this.AccountInfo = data;
        });
    },
  },
  mounted() {
    this.getAccountInfo();
  },
};
</script>
