<template>
  <div class="container-login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="form-warp"
      hide-required-asterisk
    >
      <h2>用户登录</h2>
      <el-form-item prop="rolename">
        <el-select
          class="wide"
          v-model="form.rolename"
          placeholder="请选择登录角色"
        >
          <el-option
            v-for="item in LoginRoles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          class="wide"
          v-model="form.username"
          placeholder="账户名"
          prefix-icon="el-icon-user"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="wide"
          v-model="form.password"
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-unlock"
          clearable
        ></el-input>
      </el-form-item>
      <el-button class="wide" type="primary" @click="login">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from '../api/axios';

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单
      form: {
        rolename: '', // 角色名
        username: '', // 用户名
        password: '', // 密码
      },
      // 表单的验证规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { validator: this.validatePass, trigger: ['blur', 'change'] },
        ],
        rolename: [
          { required: true, message: '请选择登录角色', trigger: 'blur' },
        ],
      },
      LoginRoles: [], // 从 role 表中获取
    };
  },
  methods: {
    // 登录
    login() {
      // 验证表单规则是否通过
      this.$refs.form.validate(async (valid) => {
        // 表单验证通过
        if (valid) {
          // 验证登录角色是否为管理员，若是则继续执行，不是则验证输入的用户名是否为身份证号
          if (this.form.rolename !== 'admin') {
            // 身份证号正则表达式
            const regIdentify = /^([1-6][1-9]|50)\d{4}(18|19|20|21)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!regIdentify.test(this.form.username)) {
              this.$message.warning(
                '身份证号格式不正确或该角色请用身份证号作为用户名进行登录',
              );
              return;
            }
          }
          const { state, message } = await axios.sendRequest({
            url: '/user/login',
            method: 'POST',
            data: this.form,
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            // 根据不同的登录角色跳转到不同的页面
            await this.$router.push({ name: this.form.rolename });
          }
        } else {
          // 表单不通过 -- 弹出错误信息
          this.$message.error('表单验证不通过');
        }
      });
    },
  },
  async mounted() {
    // 获取角色数据
    const { data } = await axios.sendRequest({ url: '/role/list/only', method: 'GET' });
    // 对数据进行处理，变为 select 选择框可使用的结构
    data.forEach((item) => {
      this.LoginRoles.push({
        value: item.role_name_en,
        label: item.role_name,
      });
    });
  },
};
</script>

<style scoped>
.container-login {
  width: 100%;
  height: 100%;
  background-color: #557085;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-login .form-warp {
  width: 400px;
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 8px 8px 1px 1px rgba(78, 78, 80, 0.2);
}
.container-login h2 {
  margin-bottom: 30px;
  text-align: center;
}
.container-login .wide {
  width: 100%;
}
</style>
