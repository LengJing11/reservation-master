<!-- 教练练车时间安排页面 -->
<template>
  <div style="height: 100%">
    <el-card style="height: 100%">
      <!-- 1.面包屑 -->
      <MyBread url="coach" level1="练车时间安排"/>
      <!-- 2.日期段选择 -->
      <h2>教练练车时间安排</h2>
      <span class="el-form-item__label distance">开始日期</span>
      <el-date-picker
        :disabled="disableAll"
        v-model="ArrangeInfo.start_date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        class="width"
      ></el-date-picker>
      <span class="el-form-item__label distance">结束日期</span>
      <el-date-picker
        :disabled="disableAll"
        v-model="ArrangeInfo.end_date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        class="width"
      ></el-date-picker>
      <!-- 3.时间段选择-->
      <span class="el-form-item__label distance">开始时间</span>
      <el-time-select
        :disabled="disableAll"
        placeholder="起始时间"
        v-model="ArrangeInfo.start_time"
        :picker-options="{
          start: '07:00',
          step: '00:30',
          end: '09:00',
        }"
        class="width"
      ></el-time-select>
      <span class="el-form-item__label distance">结束时间</span>
      <el-time-select
        :disabled="disableAll"
        placeholder="结束时间"
        v-model="ArrangeInfo.end_time"
        :picker-options="{
          start: '16:00',
          step: '00:30',
          end: '19:00',
          minTime: ArrangeInfo.start_time,
        }"
        class="width"
      ></el-time-select>
      <span class="el-form-item__label distance">间隔时间设置</span>
      <el-select
        v-model="ArrangeInfo.interval_time"
        placeholder="间隔时间"
        :disabled="disableAll"
        class="width"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <span class="el-form-item__label distance"
      >间隔时间内练车学员人数设置</span
      >
      <el-select
        v-model="ArrangeInfo.number_limit"
        placeholder="学员人数"
        :disabled="disableAll"
        class="width"
      >
        <el-option
          v-for="item in number_limit"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <div style="float: right; margin-top: 30px">
        <el-button type="primary" @click="updateArrange()" plain round>修改信息</el-button>
        <el-button type="success" @click="saveTimeArrange()" plain round>保存信息</el-button>
        <el-button @click="cancelTimeArrange()" round>取消修改</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'Schedule',
  data() {
    return {
      disableAll: true, // 控制是否禁用
      interval_time: '01:00', // 默认设置为 1 小时，配合 options 使用
      options: ['01:00', '02:00'], // 间隔时间段选项
      number_limit: [2, 3, 4, 5, 6], // 人数选项
      // 教练未安排练车时间，显示以下默认信息
      ArrangeInfo: {
        identify: '',
        name: '',
        start_date: '',
        end_date: '',
        start_time: '08:00',
        end_time: '17:00',
        interval_time: '02:00',
        number_limit: 2,
      },
    };
  },
  methods: {
    // 修改信息按钮操作
    async updateArrange() {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改练车时间安排');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.disableAll = false;
    },
    // 将选择好的时间段放入数据库
    async saveTimeArrange() {
      // 判断是否选择日期 -- 其他都有默认值，不用判断
      if (this.ArrangeInfo.start_date === '' || this.ArrangeInfo.end_date === '') {
        this.$message.info('请选择日期');
        return;
      }
      // 还要判断开始日期是否大于结束日期，是切换位置
      if (
        new Date(this.ArrangeInfo.start_date).getTime()
        > new Date(this.ArrangeInfo.end_date).getTime()
      ) {
        const temp = this.ArrangeInfo.start_date;
        this.ArrangeInfo.start_date = this.ArrangeInfo.end_date;
        this.ArrangeInfo.end_date = temp;
      }
      // 判断日期时间段是否超出7天
      if (
        new Date(this.ArrangeInfo.end_date).getTime()
        - new Date(this.ArrangeInfo.start_date).getTime()
        > 3600 * 1000 * 24 * 6
      ) {
        this.$message.warning('最长练车时间安排日期不能超过七天');
        return;
      }
      // 判断是否允许修改数据
      if (!this.disableAll) {
        let state;
        let message;
        // 判断是否为第一次安排时间
        if (this.ArrangeInfo.isArranged) {
          // 更新操作 -- 第N次安排时间
          const {
            state: status,
            message: msg,
          } = await axios.sendRequest({
            url: '/arrange/update',
            method: 'POST',
            data: {
              id: this.ArrangeInfo.id,
              start_date: this.ArrangeInfo.start_date,
              end_date: this.ArrangeInfo.end_date,
              start_time: this.ArrangeInfo.start_time,
              end_time: this.ArrangeInfo.end_time,
              interval_time: this.ArrangeInfo.interval_time,
              number_limit: this.ArrangeInfo.number_limit,
            },
          });
          state = status;
          message = msg;
        } else {
          // 添加操作 -- 第一次安排时间
          const {
            state: status,
            message: msg,
          } = await axios.sendRequest({
            url: '/arrange/new',
            method: 'POST',
            data: {
              identify: this.ArrangeInfo.identify,
              name: this.ArrangeInfo.name,
              start_date: this.ArrangeInfo.start_date,
              end_date: this.ArrangeInfo.end_date,
              start_time: this.ArrangeInfo.start_time,
              end_time: this.ArrangeInfo.end_time,
              interval_time: this.ArrangeInfo.interval_time,
              number_limit: this.ArrangeInfo.number_limit,
            },
          });
          state = status;
          message = msg;
        }
        if (state !== 0) {
          this.$message.error(message);
        } else {
          // 练车安排成功重新获取数据（修改可以不需要重新获取数据）
          await this.getArrangedTime();
          this.$message.success(message);
        }
        this.disableAll = true;
      } else {
        // 不允许修改数据 -- 提示信息进行修改
        this.$message.info('目前信息不可修改，请点击修改信息');
      }
    },
    // 取消时间安排
    cancelTimeArrange() {
      if (!this.disableAll) {
        this.disableAll = true;
        // 重新获取安排时间数据
        this.getArrangedTime();
        this.$message.info('已取消修改');
      }
    },
    async getArrangedTime() {
      const { data } = await axios.sendRequest({
        url: '/coach/arrange/username',
        method: 'POST',
      });
      this.ArrangeInfo.identify = data.identify;
      this.ArrangeInfo.name = data.name;
      if (data.start_date) {
        // 处理日期
        data.start_date = new Date(data.start_date).toLocaleDateString('fr-CA');
        data.end_date = new Date(data.end_date).toLocaleDateString('fr-CA');
        this.ArrangeInfo = data;
      }
    },
  },
  mounted() {
    this.getArrangedTime();
  },
};
</script>

<style scoped>
h2 {
  font-weight: 900;
  font-family: "Courier New", Courier, monospace;
  margin-top: 30px;
}

.distance {
  margin-left: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 15px;
}

.width {
  width: 100%;
  margin-left: 10px;
}
</style>
