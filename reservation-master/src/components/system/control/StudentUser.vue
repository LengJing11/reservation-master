<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread
      url="admin"
      level1="系统管理"
      level2="控制面板"
      level3="学员管理"
    />
    <!-- 2.搜索 -->
    <el-input
      placeholder="请输入学员姓名"
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
    <!-- 添加学员按钮 -->
    <el-button type="success"  @click="dialogVisible">添加学员</el-button>
    <!-- 3.表格 -->
    <el-table :data="filterData" style="width: 100%;" max-height="800">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" width="100"></el-table-column>
      <el-table-column
        prop="identify"
        label="身份证号"
        width="230"
      ></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="170"></el-table-column>
      <el-table-column
        prop="address"
        label="当前住址"
        width="280"
      ></el-table-column>
      <el-table-column
        prop="model"
        label="申请车型"
        width="100"
      ></el-table-column>
      <el-table-column prop="coach_name" label="教练" width="100"></el-table-column>
      <el-table-column
        prop="issuance_date"
        label="领证日期"
        width="150"
        sortable
      ></el-table-column>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="hendleEdit(scope.row)"
            style="margin-right: 10px"
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
    <!-- 添加/修改学员的对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogStudentFormVisible"
      width="440"
    >
      <el-form :model="form" :rules="rules" ref="formStudent" label-width="100px"
               hide-required-asterisk>
        <el-form-item prop="name" label="姓名">
          <el-input
            v-model="form.name"
            placeholder="姓名"
            :readonly="!isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex" :disabled="!isAdd">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="identify" label="身份证号">
          <el-input
            v-model="form.identify"
            placeholder="身份证号"
            :readonly="!isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item prop="address" label="当前住址">
          <el-input v-model="form.address" placeholder="当前住址"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model.number="form.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="model" label="申请车型">
          <el-select
            v-model="form.model"
            placeholder="请选择申请车型"
            style="width: 100%"
            :disabled="!isAdd"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领证日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="form.issuance_date"
            placeholder="选择领证日期"
            style="width: 100%"
            :disabled="isAdd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="coach_name" label="教练姓名">
          <el-select
            v-model="form.coach_name"
            placeholder="请选择教练"
            style="width: 100%"
            :disabled="!isAdd"
          >
            <el-option
              v-for="item in coachName"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="handleUser()">保存信息</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from '../../../api/axios';

export default {
  name: 'StudentUser',
  data() {
    return {
      search: '', // 搜索输入框输入的内容
      isAdd: true, // false: 编辑 true: 添加
      dialogStudentFormVisible: false, // 控制学员对话框的显示与隐藏
      filterData: [],
      UserData: [], // 请求获取的学员或教练数据
      coachName: [], // 获取教练名集合
      // 学员表单
      form: {
        identify: '',
        name: '',
        sex: '男',
        address: '',
        phone: '',
        model: '',
        issuance_date: '',
        coach_name: '',
      },
      // 学员表单验证规则
      rules: {
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 6,
            message: '长度在2到6个字符',
            trigger: 'blur',
          },
        ],
        identify: [{
          validator: this.validateIdentify,
          trigger: ['blur', 'change'],
        }],
        address: [{
          required: true,
          message: '住址不能为空',
          trigger: 'blur',
        }],
        phone: [{
          validator: this.checkPhone,
          trigger: ['blur', 'change'],
        }],
        model: [
          {
            required: true,
            message: '申请车型不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        coach_name: [
          {
            required: true,
            message: '教练名不能为空',
            trigger: ['blur', 'change'],
          },
        ],
      },
      title: '',
    };
  },
  methods: {
    // 隐藏对话框 -- 重新获取数据
    dialogCancel() {
      this.dialogStudentFormVisible = false;
      if (!this.isAdd) {
        this.getStudentListData();
      } else {
        this.form = {
          sex: '男',
          issuance_date: '',
        };
      }
    },
    // 搜索功能实现
    searchUser() {
      this.filterData = this.UserData.filter((item) => (
        !this.search
        || item.name.toLowerCase()
          .includes(this.search.toLowerCase())
      ));
      this.search = '';
    },
    // 获取学员数据
    async getStudentListData() {
      const { data } = await axios.sendRequest({
        url: '/student/list',
      });
      data.forEach((item) => {
        if (item.issuance_date) {
          item.issuance_date = new Date(item.issuance_date).toLocaleDateString('fr-CA');
          item.isdel = Boolean(item.isdel);
        }
      });
      this.filterData = this.UserData = data;
    },
    // 显示添加学员的对话框 + 权限判断
    async dialogVisible() {
      const { state, message } = await this.SecondaryAuthorityJudgment('添加学员');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      // 重置表单
      this.form = {
        sex: '男',
        issuance_date: '',
      };
      this.isAdd = true; // 添加操作
      this.title = '添加学员信息'; // 修改对话框标题
      this.dialogStudentFormVisible = true; // 显示添加学员对话框
    },
    // 添加学员(同时添加默认账户)
    addUser() {
      this.$refs.formStudent.validate(async (valid) => {
        if (valid) {
          this.dialogStudentFormVisible = false;
          // 关于教练信息的处理、关于教练id的处理
          this.coachName.forEach((element) => {
            if (element.name === this.form.coach_name) {
              this.form.coach_id = element.id;
            }
          });
          const { state, message } = await axios.sendRequest({
            url: '/student/new',
            method: 'POST',
            data: {
              student: this.form,
              account: {
                username: this.form.identify,
                password:
                  `j${this.form.identify.substring(this.form.identify.length - 6)}`,
                rolename: 'student',
              },
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            await this.getStudentListData();
            // 清空表单
            this.form = {
              sex: '男',
              issuance_date: '',
            };
            // 提示信息
            this.$message.success(message);
          }
        } else {
          this.$message.info('表单验证信息不通过');
        }
      });
    },
    // 修改学员
    updateUser() {
      this.$refs.formStudent.validate(async (valid) => {
        if (valid) {
          this.dialogStudentFormVisible = false;
          const { state, message } = await axios.sendRequest({
            url: '/student/update',
            method: 'POST',
            data: {
              identify: this.form.identify,
              address: this.form.address,
              phone: this.form.phone,
              issuance_date: this.form.issuance_date,
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            await this.getStudentListData();
            // 清空表单
            this.form = {
              sex: '男',
              issuance_date: '',
            };
            // 提示信息
            this.$message.success(message);
          }
        } else {
          this.$message.warning('表单验证信息不通过');
        }
      });
    },
    // 删除学员（删除学院权限）
    async handleDelete(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除学员');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      if (row.isdel) {
        this.$message.warning('该学员已删除');
        return;
      }
      const { state, message } = await axios.sendRequest({
        url: `/student/del/${row.id}`,
        method: 'POST',
        data: {
          identify: row.identify,
        },
      });
      if (state !== 0) {
        this.$message.error(message);
      } else {
        row.isdel = true;
        this.$message.success(message);
      }
    },
    // 获取所有教练名
    async getCoachName() {
      const { data } = await axios.sendRequest({
        url: '/coach/list/name',
      });
      this.coachName = data;
    },
    // 确定是添加还是编辑操作
    handleUser() {
      if (this.isAdd) {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    // 编辑学员信息（修改学员权限）
    async hendleEdit(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改学员');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.isAdd = false; // 编辑操作
      this.title = '编辑学员信息'; // 对话框标题
      this.form = row; // 回显信息
      this.dialogStudentFormVisible = true; // 显示对话框
    },
  },
  mounted() {
    this.getStudentListData();
    this.getCoachName();
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
