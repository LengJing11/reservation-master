<template>
  <el-card style="height: 100%;">
    <!-- 1.面包屑 -->
    <MyBread url="admin" level1="教练管理"/>
    <!-- 2.搜索 -->
    <el-input
      placeholder="请输入教练姓名"
      v-model="search"
      class="with-input"
      clearable
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchUser"
      ></el-button>
    </el-input>
    <!-- 添加教练按钮 -->
    <el-button type="success" @click="dialogVisible">添加教练</el-button>
    <!-- 3.表格 -->
    <el-table :data="filterData" style="width: 100%;" max-height="800">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80"></el-table-column>
      <el-table-column prop="identify" label="身份证号" width="230"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="years" label="教练教龄"></el-table-column>
      <el-table-column label="是否安排练车时间" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isArranged"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已安排"
            inactive-text="未安排"
            disabled
            class="switch"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isdel"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="已注销"
            inactive-text="未注销"
            disabled
            class="switch"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="reverse_car" label="预约车辆"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.row)"
            style="margin-right: 10px;"
          ></el-button>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该用户信息吗？"
            @confirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              type="danger"
              circle
              icon="el-icon-delete"
            >
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加教练的对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogCoachFormVisible"
      width="440"
    >
      <el-form :model="CoachInfo" :rules="rules" ref="CoachInfo">
        <el-form-item prop="name">
          <el-input v-model="CoachInfo.name" placeholder="姓名" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="CoachInfo.sex" :disabled="!isAdd">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="identify">
          <el-input
            v-model="CoachInfo.identify"
            placeholder="身份证号"
            :disabled="!isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model.number="CoachInfo.phone"
            placeholder="联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item prop="years">
          <el-input
            v-model.number="CoachInfo.years"
            placeholder="教练教龄"
            :disabled="!isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item prop="reverse_car" v-if="CoachInfo.reverse_car">
          <el-input
            v-model.number="CoachInfo.reverse_car"
            placeholder="预约车辆"
            :disabled="!isAdd"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="handleUser()">保存信息</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from '../../../api/axios';

export default {
  name: 'CoachUser',
  data() {
    return {
      search: '', // 搜索输入框输入的内容
      isAdd: true, // true：添加 false：更新
      dialogCoachFormVisible: false, // 控制教练对话框的显示与隐藏
      filterData: [],
      UserData: [], // 请求获取的教练数据
      // 教练表单
      CoachInfo: {
        identify: '',
        name: '',
        sex: '男',
        phone: '',
        years: '',
      },
      // 教练表单验证规则
      rules: {
        // 可以添加身份证号验证规则，样式同phone
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 12,
            message: '长度在2到12个字符',
            trigger: 'blur',
          },
        ],
        identify: [{
          validator: this.validateIdentify,
          trigger: ['blur', 'change'],
        }],
        phone: [{
          validator: this.checkPhone,
          trigger: ['blur', 'change'],
        }],
        years: [
          {
            required: true,
            message: '教龄不能为空',
            trigger: 'blur',
          },
          {
            type: 'number',
            message: '必须输入数字',
            trigger: 'blur',
          },
        ],
      },
      title: '', // 对话框标题：添加还是更新信息
    };
  },
  methods: {
    // 取消添加或更新操作
    cancel() {
      this.dialogCoachFormVisible = false;
      if (!this.isAdd) {
        // 更新操作时取消 -- 重新获取数据
        this.getCoachListData();
      } else {
        this.CoachInfo = { sex: '男' };
      }
    },
    // 搜索功能实现
    async searchUser() {
      this.filterData = this.UserData.filter((item) => (
        !this.search
        || item.name.toLowerCase()
          .includes(this.search.toLowerCase())
      ));
      this.search = '';
    },
    // 获取教练数据
    async getCoachListData() {
      const { data } = await axios.sendRequest({
        url: '/coach/list',
        method: 'POST',
      });
      data.forEach((item) => {
        item.isArranged = Boolean(item.isArranged);
        item.isdel = Boolean(item.isdel);
      });
      this.filterData = this.UserData = data;
    },
    // 显示添加教练的对话框
    async dialogVisible() {
      const { state, message } = await this.SecondaryAuthorityJudgment('添加教练');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      // 清空表单
      this.CoachInfo = { sex: '男' };
      // 显示添加教练对话框
      this.isAdd = true;
      this.title = '添加教练信息';
      this.dialogCoachFormVisible = true;
    },
    // 添加教练信息到json-server数据库
    addUser() {
      this.$refs.CoachInfo.validate(async (valid) => {
        if (valid) {
          this.dialogCoachFormVisible = false;
          const { state, message } = await axios.sendRequest({
            url: '/coach/new',
            method: 'POST',
            data: {
              coach: this.CoachInfo,
              account: {
                username: this.CoachInfo.identify,
                password:
                  `j${
                    this.CoachInfo.identify.substring(
                      this.CoachInfo.identify.length - 6,
                    )}`,
                rolename: 'coach',
              },
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            // 清空表单
            this.CoachInfo = { sex: '男' };
            this.$message.success(message);
            this.getCoachListData();
          }
        } else {
          this.$message.info('表单验证信息不通过');
        }
      });
    },
    // 根据id更新教练信息到json-server数据库
    updateUser() {
      this.$refs.CoachInfo.validate(async (valid) => {
        if (valid) {
          this.dialogCoachFormVisible = false;
          const { state, message } = await axios.sendRequest({
            url: '/coach/update',
            method: 'POST',
            data: {
              identify: this.CoachInfo.identify,
              phone: this.CoachInfo.phone,
            },
          });
          console.log(message);
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.CoachInfo = { sex: '男' };
            this.$message.success(message);
          }
        } else {
          this.$message.info('表单验证信息不通过');
        }
      });
    },
    // 删除教练信息（删除教练权限）
    async handleDelete(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除教练');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      if (row.isdel) {
        this.$message.warning('该教练已删除');
        return;
      }
      const { state, message } = await axios.sendRequest({
        url: `/coach/del/${row.id}`,
        method: 'POST',
        data: {
          identify: row.identify,
        },
      });
      if (state !== 0) {
        this.$message.error(message);
      } else {
        row.isdel = true;
        this.$message.success('教练删除成功');
      }
    },
    // 处理：确定是添加还是更新操作
    handleUser() {
      if (this.isAdd) {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    // 编辑学员或教练信息 -- 弹出对话框，修改标题，回显数据
    // 修改教练权限
    async handleEdit(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改教练');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.isAdd = false;
      this.title = '编辑教练信息';
      this.CoachInfo = row;
      this.dialogCoachFormVisible = true;
    },
  },
  mounted() {
    // 获取教练数据
    this.getCoachListData();
  },
};
</script>

<style scoped>
.with-input {
  width: 500px;
  margin-top: 30px;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
