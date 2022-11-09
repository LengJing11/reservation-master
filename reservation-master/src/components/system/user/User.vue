<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="admin" level1="系统管理" level2="账户管理"/>
    <!-- 2.搜索 -->
    <el-input
      placeholder="请输入用户名"
      v-model="search"
      class="with-input"
      clearable
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchAccount()"
      ></el-button>
    </el-input>
    <!-- 3.表格 -->
    <UserTable
      :userData="filterData"
      :handleDelete="handleDelete"
      :handleEdit="handleEdit"
      :handleRole="handleRole"
    />
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑账户信息"
      :visible.sync="dialogFormVisible"
      width="440"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item>
          <el-input
            v-model="form.username"
            readonly
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span class="el-input__inner">{{
              handleRole(form.rolename)
            }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyButton()">取 消</el-button>
        <el-button type="primary" @click="updateAccountButton()"
        >修改密码
        </el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import UserTable from './UserTable.vue';
import axios from '../../../api/axios';

export default {
  name: 'User',
  components: { UserTable },
  data() {
    return {
      search: '', // 搜索输入框输入的内容
      dialogFormVisible: false, // 控制用户对话框的显示与隐藏
      filterData: [],
      UserData: [], // 请求获取的用户数据
      // 用户表单
      form: {
        username: '',
        password: '',
        rolename: '',
        create_time: '',
      },
      // 用户表单验证规则
      rules: {
        // 用户名、登录角色完全只读 ==> 不能修改，不用添加验证规则
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
    // 对于角色显示的处理
    handleRole(rolename) {
      if (rolename === 'student') {
        return '学员';
      }
      if (rolename === 'coach') {
        return '教练';
      }
      return '管理员';
    },
    // 搜索功能实现
    searchAccount() {
      this.filterData = this.UserData.filter((item) => !this.search
        || item.username.toLowerCase()
          .includes(this.search.toLowerCase()));
      this.search = '';
    },
    // 取消更新或添加操作 -- 重新获取数据
    cancelModifyButton() {
      this.dialogFormVisible = false;
      this.getUserList();
    },
    // 获取账户数据
    async getUserList() {
      const { data } = await axios.sendRequest({
        url: '/user/list',
      });
      // 对日期和isdel进行处理
      data.forEach((item) => {
        item.create_time = new Date(item.create_time).toLocaleDateString('fr-CA');
        item.isdel = Boolean(item.isdel);
      });
      this.filterData = this.UserData = data;
    },
    // 根据id更新用户信息到json-server数据库
    updateAccountButton() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          // 发送数据
          const {
            state,
            message,
          } = await axios.sendRequest({
            url: '/user/update',
            method: 'POST',
            data: {
              username: this.form.username,
              password: this.form.password,
            },
          });
          if (state !== 0) {
            this.$message.error(message);
            // 重新获取用户数据
            await this.getUserList();
          } else {
            // 清空表单
            this.form = {};
            // 提示信息
            this.$message.success(message);
          }
        } else {
          this.$message.warning('表单验证信息不通过');
        }
      });
    },
    // 删除账户 -- 删除账户对应的学员或教练信息
    async handleDelete(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除账户');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      // 判断删除的账户是否为管理员
      if (row.rolename === 'admin') {
        this.$message.warning('管理员不能删除');
        return;
      }
      // 判断账户是否已注销
      if (row.isdel) {
        this.$message.warning('该账号已注销');
        return;
      }
      // 删除账户操作(同时删除对应用户)
      const {
        state,
        message,
      } = await axios.sendRequest({
        url: `/user/del/${row.id}`,
        method: 'POST',
        data: {
          identify: row.username,
          rolename: row.rolename,
        },
      });
      if (state !== 0) {
        this.$message.error(message);
        // 重新获取用户数据
        await this.getUserList();
      } else {
        row.isdel = true;
        this.$message.success(message);
      }
    },
    // 编辑用户信息
    async handleEdit(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改账户');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      // 回显数据，显示对话框
      this.form = row;
      this.dialogFormVisible = true;
    },
  },
  mounted() {
    // 获取用户数据
    this.getUserList();
  },
};
</script>

<style scoped>
.with-input {
  width: 500px;
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
