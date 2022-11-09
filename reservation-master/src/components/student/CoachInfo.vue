<template>
  <el-card style="height: 100%">
    <MyBread url="student" level1="教练信息" />
    <h2 class="myh2">教练信息展示</h2>
    <el-form :model="currentCoachInfo" label-width="100px">
      <el-form-item label="教练姓名">
        <el-input v-model="currentCoachInfo.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="教练性别">
        <el-radio-group v-model="currentCoachInfo.sex" disabled>
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="currentCoachInfo.identify" readonly></el-input>
      </el-form-item>
      <el-form-item label="教练电话">
        <el-input v-model="currentCoachInfo.phone" readonly></el-input>
      </el-form-item>
      <el-form-item label="预约车辆" v-if="currentCoachInfo.reverse_car">
        <el-input v-model="currentCoachInfo.reverse_car" readonly></el-input>
      </el-form-item>
      <el-form-item label="教练教龄">
        <el-input v-model="currentCoachInfo.years" readonly></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'CoachInfo',
  data() {
    return {
      currentCoachInfo: {},
    };
  },
  mounted() {
    // 获取学员的教练信息
    axios
      .sendRequest({
        url: '/coach/detail',
        method: 'POSt',
      })
      .then(({ data }) => {
        this.currentCoachInfo = data;
      });
  },
};
</script>

<style scoped>
.myh2 {
  font-size: 30px;
  text-align: center;
  color: #555;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
