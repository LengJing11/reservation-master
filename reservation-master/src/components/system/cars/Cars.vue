<template>
  <div class="box">
    <el-card shadow class="card">
      <!-- 1.面包屑 -->
      <MyBread url="admin" level1="车辆管理" />
      <!-- 2.搜索 -->
      <el-input
        placeholder="请输入车牌号"
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
      <!-- 添加车辆按钮 -->
      <el-button type="success" @click="dialogVisible">添加车辆</el-button>
      <!-- 3.表格 -->
      <el-table :data="filterData" style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="car_number" label="车牌号"></el-table-column>
        <el-table-column prop="valid_date" label="有效日期"></el-table-column>
        <el-table-column prop="logon_date" label="注册日期"></el-table-column>
        <el-table-column
          prop="insurance_date"
          label="保险日期"
        ></el-table-column>
        <el-table-column prop="scrap_date" label="报废日期"></el-table-column>
        <el-table-column prop="appoint_date" label="预约日期" sortable></el-table-column>
        <el-table-column prop="count" label="使用次数"></el-table-column>
        <el-table-column label="是否预约" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isuse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="已预约"
              inactive-text="未预约"
              disabled
              class="switch"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否预约" width="100">
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
        <el-table-column label="操作" width="310">
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
              title="确定删除该车辆信息吗？"
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
            <el-button
              type="info"
              size="mini"
              @click="hendleDistribute(scope.row)"
              class="distribution-button"
              >分配教练</el-button
            >
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定取消分配吗？"
              @confirm="handleCancelDistribute(scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
                class="cancel-distribution-button"
                >取消分配
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加车辆的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="440">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" hide-required-asterisk>
        <el-form-item prop="car_number" label="车牌号">
          <el-input v-model="form.car_number" placeholder="车辆名" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item prop="logon_date" label="注册日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            v-model="form.logon_date"
            type="date"
            placeholder="注册日期"
            :disabled="!isAdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="valid_date" label="有效日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            v-model="form.valid_date"
            type="date"
            placeholder="有效日期"
            :disabled="!isAdd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="insurance_date" label="保险日期">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            v-model="form.insurance_date"
            type="date"
            placeholder="保险日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报废日期">
          <el-date-picker
            :disabled="isAdd"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            v-model="form.scrap_date"
            type="date"
            placeholder="报废日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约日期" v-if="form.appoint_date">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            v-model="form.appoint_date"
            type="date"
            placeholder="预约日期"
            disabled
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="handleUser">保存信息</el-button>
      </div>
    </el-dialog>
    <!-- 分配教练对话框 -->
    <el-dialog
      title="请选择分配教练"
      :visible.sync="getDistributeVisible"
      width="440"
    >
      <div style="width: 100%">
        <el-select v-model="Coach" placeholder="请选择教练" style="width: 100%">
          <el-option
            v-for="item in coachName"
            :key="item.identify"
            :label="item.name"
            :value="item.identify"
          >
          </el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="getDistributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributeCoach()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../../api/axios';

export default {
  name: 'Cars',
  data() {
    return {
      search: '', // 搜索输入框输入的内容
      isAdd: true, // true：添加 false：删除
      dialogFormVisible: false, // 控制车辆对话框的显示与隐藏
      getDistributeVisible: false, // 分配教练对话框的显示与隐藏
      filterData: [],
      UserData: [], // 请求获取的车辆数据
      coachName: [], // 教练名
      Coach: '', // 分配的教练名
      singleRow: {}, // 被选中的一条车辆数据
      // 车辆表单
      form: {
        car_number: '', // 车牌号
        logon_date: '', // 注册日期
        insurance_date: '', // 保险日期
        valid_date: '', // 有效期
      },
      // 车辆表单验证规则
      rules: {
        car_number: [
          { required: true, message: '车辆名不能为空', trigger: 'blur' },
        ],
        logon_date: [
          { required: true, message: '注册日期不能为空', trigger: 'change' },
        ],
        insurance_date: [
          { required: true, message: '保险日期不能为空', trigger: 'change' },
        ],
        valid_date: [
          { required: true, message: '有效日期不能为空', trigger: 'change' },
        ],
      },
      title: '', // 对话框标题
    };
  },
  methods: {
    // 取消更新或添加
    cancel() {
      this.dialogFormVisible = false;
      if (!this.isAdd) {
        this.getCarList();
      } else {
        this.form = {};
      }
    },
    // 搜索功能实现
    searchUser() {
      this.filterData = this.UserData.filter((item) => (
        !this.search
        || item.car_number.toLowerCase().includes(this.search.toLowerCase())
      ));
      this.search = '';
    },
    // 获取车辆数据
    async getCarList() {
      const { data } = await axios.sendRequest({
        url: '/car/list',
      });
      data.forEach((item) => {
        item.logon_date = new Date(item.logon_date).toLocaleDateString('fr-CA');
        item.insurance_date = new Date(item.insurance_date).toLocaleDateString('fr-CA');
        item.valid_date = new Date(item.valid_date).toLocaleDateString('fr-CA');
        if (item.appoint_date) {
          item.appoint_date = new Date(item.appoint_date).toLocaleDateString('fr-CA');
        }
        if (item.scrap_date) {
          item.scrap_date = new Date(item.scrap_date).toLocaleDateString('fr-CA');
        }
        item.isuse = Boolean(item.isuse);
        item.isdel = Boolean(item.isdel);
        // 如果预约时间已过，置空
        if (new Date(item.appoint_date).getTime() < Date.now()) {
          item.appoint_date = '';
        }
      });
      this.filterData = this.UserData = data;
    },
    // 显示添加车辆的对话框 （添加车辆权限）
    async dialogVisible() {
      const { state, message } = await this.SecondaryAuthorityJudgment('添加车辆');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.form = {};
      // 显示添加车辆对话框
      this.isAdd = true;
      this.title = '添加车辆信息';
      this.dialogFormVisible = true;
    },
    // 添加车辆信息到json-server数据库
    addUser() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          const { state, message } = await axios.sendRequest({
            url: '/car/new',
            method: 'POST',
            data: this.form,
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.getCarList();
            this.form = {};
            this.$message.success(message);
          }
        } else {
          this.$message.warning('表单验证信息不通过');
        }
      });
    },
    // 根据id更新车辆信息到json-server数据库
    updateUser() {
      if (this.form.isdel) {
        this.$message.warning('该车辆已注销，不可更改');
        return;
      }
      // 只能修改 insurance_date, acrap_date
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          const { state, message } = await axios.sendRequest({
            url: '/car/update',
            method: 'POST',
            data: {
              car_number: this.form.car_number,
              insurance_date: this.form.insurance_date,
              scrap_date: this.form.scrap_date,
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.form = {};
            this.$message.success(message);
          }
        } else {
          this.$message.info('表单验证信息不通过');
        }
      });
    },
    // 删除车辆（删除车辆权限）
    async handleDelete(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除车辆');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      if (row.isdel) {
        this.$message.warning('该车辆已注销');
        return;
      }
      const { state, message } = await axios.sendRequest({
        url: `/car/del/${row.id}`,
        method: 'POST',
      });
      if (state !== 0) {
        this.$message.error(message);
      } else {
        row.isdel = true;
        this.getCarList();
        this.$message.success(message);
      }
    },
    // 确定是添加还是编辑操作
    handleUser() {
      if (this.isAdd) {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    // 编辑车辆信息（修改车辆权限）
    async hendleEdit(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改车辆');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.isAdd = false;
      this.title = '编辑车辆信息';
      this.form = row;
      this.dialogFormVisible = true;
    },
    // 按钮处理分配教练（分配教练权限）
    async hendleDistribute(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('分配教练');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      if (row.isuse) {
        this.$message.info('已分配教练');
      } else {
        this.singleRow = row;
        this.getDistributeVisible = true;
      }
    },
    // 分配教练
    async distributeCoach() {
      if (this.Coach === '') {
        this.$message.info('请选择教练');
        return;
      }
      // 更新车辆数据
      this.singleRow.isuse = 1;
      this.singleRow.count++;
      // 修改预约日期
      const date = Date.now() + 3600 * 1000 * 24;
      this.singleRow.appoint_date = new Date(date).toLocaleDateString('fr-CA');
      const { state, message } = await axios.sendRequest({
        url: '/car/assigned',
        method: 'POST',
        data: {
          car: {
            car_number: this.singleRow.car_number,
            appoint_date: this.singleRow.appoint_date,
            count: this.singleRow.count,
            isuse: this.singleRow.isuse,
          },
          coach_identify: this.Coach,
        },
      });
      if (state !== 0) {
        this.$message.error(message);
      } else {
        this.singleRow.isuse = true;
        this.singleRow = {};
        this.$message.success(message);
      }
      this.getDistributeVisible = false;
    },
    // 取消分配（取消分配权限）
    async handleCancelDistribute(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('取消分配');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      if (row.isuse) {
        this.getDistributeVisible = false;
        // 若预约的时间已经过去，使用次数不需要减少，未过则减少
        if (new Date(row.appoint_date).getTime() > Date.now()) {
          row.count--;
        }
        // 更新车辆数据
        row.isuse = 0;
        row.appoint_date = '';
        const { state, message } = await axios.sendRequest({
          url: '/car/unassigned',
          method: 'POST',
          data: {
            car_number: row.car_number,
            count: row.count,
            isuse: row.isuse,
          }
        });
        if (state !== 0) {
          this.$message.error(message);
        } else {
          row.isuse = false;
          this.$message.success(message);
        }
      } else {
        this.$message.info('未分配教练');
      }
    },
  },
  async mounted() {
    // 获取教练信息
    const { data } = await axios.sendRequest({
      url: '/coach/list',
      method: 'POST',
    });
    data.forEach((item) => {
      this.coachName.push({
        identify: item.identify,
        name: item.name,
      });
    });
    // 新的一天 ==> 对车辆信息重置
    const { state: status } = await axios.sendRequest({ url: '/car/reset' });
    if (status === 0) {
      // 获取车辆数据
      await this.getCarList();
    }
  },
};
</script>

<style scoped>
.box,
.card {
  height: 100%;
}
.with-input {
  width: 500px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 10px;
}
.pagination {
  margin-top: 30px;
}
.distribution-button {
  margin-left: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.cancel-distribution-button {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
