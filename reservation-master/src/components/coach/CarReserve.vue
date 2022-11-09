<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="coach" level1="车辆预定"/>
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
    <!-- 5.预约车辆 -->
    <el-button type="success" @click="cancelBookedVehicle" round>取消已预约车辆</el-button>
    <el-button type="success" @click="checkBookedVehicle" round>查看已预约车辆信息</el-button>
    <!-- 3.表格 -->
    <el-table
      ref="NotUseCarTable"
      :data="filterData"
      style="width: 100%;"
      highlight-current-row
      @row-click="handleRowClickTable"
      max-height="800"
    >
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="car_number" label="车辆名"></el-table-column>
      <el-table-column prop="logon_date" label="注册日期"></el-table-column>
      <el-table-column prop="insurance_date" label="保险日期"></el-table-column>
      <el-table-column prop="valid_date" label="有效日期"></el-table-column>
      <el-table-column prop="scrap_date" label="报废日期"></el-table-column>
      <el-table-column prop="appoint_date" label="预约日期"></el-table-column>
      <el-table-column prop="count" label="使用次数"></el-table-column>
      <el-table-column label="状态">
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
    </el-table>
    <!-- 6.对话框 -->
    <el-dialog
      title="预约车辆信息"
      :visible.sync="dialogFormVisible"
      width="440"
    >
      <el-form
        :model="AppointCarInfo"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="车牌号">
          <el-input v-model="AppointCarInfo.car_number" readonly></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-date-picker
            format="yyyy-MM-dd"
            style="width: 100%"
            v-model="AppointCarInfo.logon_date"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="保险日期">
          <el-date-picker
            format="yyyy-MM-dd"
            style="width: 100%"
            v-model="AppointCarInfo.insurance_date"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效日期">
          <el-date-picker
            format="yyyy-MM-dd"
            style="width: 100%"
            v-model="AppointCarInfo.valid_date"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报废日期" v-if="AppointCarInfo.scrap_date">
          <el-date-picker
            format="yyyy-MM-dd"
            style="width: 100%"
            v-model="AppointCarInfo.scrap_date"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约日期" v-if="AppointCarInfo.appoint_date">
          <el-date-picker
            format="yyyy-MM-dd"
            style="width: 100%"
            v-model="AppointCarInfo.appoint_date"
            readonly
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用次数">
          <el-input v-model="AppointCarInfo.count" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
                   style="width: 100%;">确定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'CarReserve',
  data() {
    return {
      search: '', // 搜索字符搜集
      coach_reverse_car: '',
      filterData: [],
      NoReversedVehicle: [], // 未被预约车辆
      dialogFormVisible: false, // 控制表单对话框的显隐
      AppointCarInfo: {}, // 预约车辆信息
    };
  },
  methods: {
    // 搜索功能实现
    searchUser() {
      this.filterData = this.NoReversedVehicle.filter((item) => !this.search
          || item.car_number.toLowerCase()
            .includes(this.search.toLowerCase()));
      this.search = '';
    },
    // 获取未被使用车辆数据
    async getNoReversedCarInfo() {
      const { data } = await axios.sendRequest({ url: '/car/not-use' });
      // 对日期和isuse进行处理
      data.forEach((element) => {
        element.logon_date = new Date(element.logon_date).toLocaleDateString();
        element.insurance_date = new Date(element.insurance_date).toLocaleDateString();
        element.valid_date = new Date(element.valid_date).toLocaleDateString();
        if (element.scrap_date) {
          element.scrap_date = new Date(element.scrap_date).toLocaleDateString();
        }
        if (element.isuse) {
          element.appoint_date = new Date(element.appoint_date).toLocaleDateString();
        } else {
          element.appoint_date = '';
        }
        element.isuse = Boolean(element.isuse);
      });
      this.filterData = this.NoReversedVehicle = data;
    },
    // 处理选中的车辆 + 权限验证
    async handleRowClickTable(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('教练预约车辆');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      if (!this.coach_reverse_car) {
        // 弹出确认框确定是否选中该辆车
        this.$confirm('是否确认预约该车辆?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            // 修改预约辆信息
            row.isuse = 1;
            // 预约日期为明天
            const date = new Date().getTime() + 24 * 3600 * 1000;
            row.appoint_date = new Date(date).toLocaleDateString('fr-CA');
            row.count++;
            const { state, message } = await axios.sendRequest({
              url: '/coach/reverse',
              method: 'POST',
              data: {
                car_number: row.car_number,
                appoint_date: row.appoint_date,
                count: row.count,
                isuse: row.isuse,
              },
            });
            if (state !== 0) {
              this.$message.error(message);
            } else {
              this.$message.success(message);
              this.coach_reverse_car = row.car_number;
            }
            this.AppointCarInfo = row; // 为取消预约做准备
            await this.getNoReversedCarInfo(); // 重新加载数据
          })
          .catch(() => {
            this.$message.info('已取消预约');
          });
      } else {
        this.$message.info('已预约车辆');
      }
    },
    // 取消已预约的车辆（删除车辆预约）
    async cancelBookedVehicle() {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除教练预约车辆');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      if (this.coach_reverse_car) {
        // 如果预约的时间已经到了，则不能取消预约
        if (new Date(this.AppointCarInfo.appoint_date).getTime() < Date.now()) {
          this.$message.info('预约时间已到，不能取消预约');
          return;
        }
        this.$confirm('是否取消预约?', '提示', {
          confirmButtonText: '确定', // 取消预约
          cancelButtonText: '取消', // 什么都不做
          type: 'warning',
        })
          .then(async () => {
            // 取消预约 -- 设置状态
            this.AppointCarInfo.isuse = 0;
            this.AppointCarInfo.appoint_date = '';
            this.AppointCarInfo.count--;
            const { state, message } = await axios.sendRequest({
              url: '/coach/reverse/cancel',
              method: 'POST',
              data: {
                car_number: this.AppointCarInfo.car_number,
                appoint_date: this.AppointCarInfo.appoint_date,
                isuse: this.AppointCarInfo.isuse,
                count: this.AppointCarInfo.count,
              },
            });
            if (state !== 0) {
              this.$message.error(message);
            } else {
              this.$message.success(message);
              this.coach_reverse_car = '';
            }
            this.AppointCarInfo = {}; // 预约车辆信息置空
            await this.getNoReversedCarInfo(); // 重新加载数据
          })
          .catch(() => {
            this.$message.info('已取消该操作');
          });
      } else {
        this.$message.info('暂未预约车辆');
      }
    },
    // 查看已预约车辆
    checkBookedVehicle() {
      if (this.coach_reverse_car) {
        // 查看预约 -- 显示对话框
        this.dialogFormVisible = true;
      } else {
        this.$message.info('暂未预约车辆');
      }
    },
  },
  async mounted() {
    // 获取教练预约车辆信息
    const { state, data } = await axios.sendRequest({
      url: '/coach/detail/car',
    });
    if (state === 0) {
      data.logon_date = new Date(data.logon_date).toLocaleDateString();
      data.insurance_date = new Date(data.insurance_date).toLocaleDateString();
      data.valid_date = new Date(data.valid_date).toLocaleDateString();
      if (data.scrap_date) {
        data.valid_date = new Date(data.valid_date).toLocaleDateString();
      }
      if (data.appoint_date) {
        data.valid_date = new Date(data.valid_date).toLocaleDateString();
      }
      data.isuse = Boolean(data.isuse);
      this.coach_reverse_car = data.car_number;
      this.AppointCarInfo = data;
    }
    // 新的一天 ==> 对车辆信息重置
    const { state: status } = await axios.sendRequest({ url: '/car/reset' });
    if (status === 0) {
      await this.getNoReversedCarInfo();
    }
  },
};
</script>

<style scoped>
.with-input {
  width: 500px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 10px;
}
</style>
