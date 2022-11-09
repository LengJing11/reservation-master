<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="coach" level1="车辆查看" />
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
        @click="searchCar()"
      ></el-button>
    </el-input>
    <!-- 3.表格 -->
    <el-table :data="filterData" style="width: 100%;" max-height="800">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="car_number" label="车辆名"></el-table-column>
      <el-table-column prop="logon_date" label="注册日期"></el-table-column>
      <el-table-column prop="insurance_date" label="保险日期"></el-table-column>
      <el-table-column prop="valid_date" label="有效日期"></el-table-column>
      <el-table-column prop="scrap_date" label="报废日期"></el-table-column>
      <el-table-column prop="appoint_date" label="预约日期"></el-table-column>
      <el-table-column prop="count" label="使用次数"></el-table-column>
      <el-table-column label="状态" width="200">
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
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'CoachCar',
  data() {
    return {
      search: '', // 搜索输入框输入的内容
      filterData: [],
      AllCarInfo: [], // 所有车辆信息
    };
  },
  methods: {
    // 搜索功能实现
    async searchCar() {
      this.filterData = this.AllCarInfo.filter((item) => (
        !this.search
          || item.car_number.toLowerCase().includes(this.search.toLowerCase())
      ));
      this.search = '';
    },
    // 获取车辆数据
    async getCarList() {
      const { data } = await axios.sendRequest({ url: '/car/list' });
      // 对日期和 isuse 进行处理
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
      this.AllCarInfo = this.filterData = data;
    },
  },
  mounted() {
    // 获取车辆数据
    this.getCarList();
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
