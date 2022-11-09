<template>
  <el-card style="height: 100%">
    <MyBread :url="url" level1="账户信息"/>
    <h2>账户信息展示</h2>
    <el-form
      ref="AccountInfo"
      label-position="right"
      :model="AccountInfo"
      label-width="100px"
      :rules="AccountInfoRules"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="AccountInfo.username"
          readonly
          prefix-icon="el-icon-user-solid"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="AccountInfo.password"
          :disabled="disablePassword"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="AccountInfo.create_time"
          readonly
          format="yyyy-MM-dd"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button type="primary" @click="updateAccountPassword()" plain round>修改密码</el-button>
      <el-button type="success" @click="saveAccountPassword()" plain round>保存密码</el-button>
      <el-button @click="cancelModifyAccountPassword()" round>取消修改</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'Account',
  props: ['url', 'AccountInfo', 'getAccountInfo', 'right'],
  data() {
    return {
      disablePassword: true, // 控制账号密码的禁用
      // 账户表单验证规则
      AccountInfoRules: {
        // 用户名，创建时间 ==> 不可修改(完全只读)，不做验证
        password: [
          {
            validator: this.validatePass,
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  methods: {
    // 修改账户信息按钮 => 权限判定 + 输入框使能
    async updateAccountPassword() {
      const {
        state,
        message,
      } = await this.SecondaryAuthorityJudgment(this.right);
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.disablePassword = false;
    },
    // 保存修改后密码 => 修改数据库信息
    saveAccountPassword() {
      if (this.disablePassword === false) {
        this.$refs.AccountInfo.validate(async (valid) => {
          if (valid) {
            // 向后台提交数据
            const {
              state,
              message,
            } = await axios.sendRequest({
              url: '/user/update',
              method: 'POST',
              data: {
                username: this.AccountInfo.username,
                password: this.AccountInfo.password,
              },
            });
            if (state !== 0) {
              // 修改失败，重新获取账户信息并弹窗提醒
              this.$message.error(message);
              this.getAccountInfo();
            } else {
              // 修改成功弹框提醒
              this.$message.success(message);
            }
            this.disablePassword = true; // 禁用
          } else {
            this.$message.warning('表单验证不通过');
          }
        });
      } else {
        this.$message.info('密码不可修改，请点击修改密码按钮');
      }
    },
    // 取消修改密码
    cancelModifyAccountPassword() {
      if (this.disablePassword === false) {
        this.disablePassword = true; // 禁用
        // 重新获取修改前登录用户的账号信息
        this.getAccountInfo();
        this.$message.info('已取消修改');
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
