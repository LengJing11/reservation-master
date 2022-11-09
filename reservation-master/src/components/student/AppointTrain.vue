<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="student" level1="预约练车时间" />
    <el-empty
      description="教练暂未安排练车时间"
      v-if="!isCoachArranged"
    ></el-empty>
    <template v-else>
      <!-- 2.显示教练安排时间-->
      <h2>教练练车时间安排</h2>
      <el-form
        :model="timeArrangeByCoach"
        label-width="170px"
        label-position="right"
      >
        <el-form-item label="开始预约日期">
          <el-input v-model="timeArrangeByCoach.start_date" readonly></el-input>
        </el-form-item>
        <el-form-item label="结束预约日期">
          <el-input v-model="timeArrangeByCoach.end_date" readonly></el-input>
        </el-form-item>
        <el-form-item label="开始预约时间">
          <el-input v-model="timeArrangeByCoach.start_time" readonly></el-input>
        </el-form-item>
        <el-form-item label="结束预约时间">
          <el-input v-model="timeArrangeByCoach.end_time" readonly></el-input>
        </el-form-item>
        <el-form-item label="练车时长">
          <el-input
            v-model="timeArrangeByCoach.interval_time"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="每个时间段最多人数">
          <el-input
            v-model="timeArrangeByCoach.number_limit"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 3.显示学员选择预约练车时间 -->
      <h2>学员练车时间预约</h2>
      <span class="el-form-item__label distance">预约日期选择</span>
      <el-date-picker
        v-model="select_date"
        type="date"
        placeholder="请选择日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        @blur="verifyDate"
        :disabled="disableAppoint"
        class="width"
      ></el-date-picker>
      <span class="el-form-item__label distance">预约开始时间</span>
      <el-time-select
        v-model="select_interval_time"
        :picker-options="timePickerOptions"
        placeholder="请选择预约时间"
        class="width"
        @blur="verifyTime()"
        :disabled="disableAppoint"
      ></el-time-select>
      <div style="float: right">
        <el-button
          type="primary"
          @click="startAppointButton()"
          style="margin-top: 25px"
          plain
          round
          >开始预约</el-button
        >
        <el-button type="success" @click="submitAppointButton()" plain round
          >提交预约</el-button
        >
        <el-button type="danger" @click="deleteAppointButton()" plain round
          >删除预约</el-button
        >
      </div>
    </template>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'AppointTrain',
  data() {
    return {
      select_date: '', // 预约日期
      select_interval_time: '', // 预约时间
      disableAppoint: true, // 控制预约日期与预约时间的禁用
      isCoachArranged: true, // 教练是否安排练车时间：true:是 / false:否
      // 预约日期选项
      pickerOptions: {
        // 只能预约今天之后的日期，不包括今天
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        // 快捷选项
        shortcuts: [
          {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      timePickerOptions: {}, // 预约时间选项
      timeArrangeByCoach: {}, // 教练练车时间安排
      currentStudentAppoint: null, // 学员预约信息
      currentStudentInfo: {}, // 学员信息
    };
  },
  methods: {
    // 验证所选日期是否超出教练安排时间
    verifyDate() {
      const appointDate = new Date(this.select_date);
      const arrangeStartDate = new Date(this.timeArrangeByCoach.start_date);
      const arrangeEndDate = new Date(this.timeArrangeByCoach.end_date);
      if (
        appointDate.getTime() < arrangeStartDate.getTime()
        || appointDate.getTime() > arrangeEndDate.getTime()
      ) {
        this.$message.info('所选日期不在教练安排日期范围内');
        this.select_date = '';
      }
    },
    // 验证选择的开始时间是否为结束时间
    verifyTime() {
      if (this.select_interval_time === this.timeArrangeByCoach.end_time) {
        this.$message.info('所选时间为结束时间，请重新选择');
        this.select_interval_time = '';
      }
    },
    // 开始预约 => 权限检测 + 开启选项框的使用
    async startAppointButton() {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改学员预约时间');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.disableAppoint = false;
    },
    // 提交预约
    async submitAppointButton() {
      if (!this.disableAppoint) {
        // 验证是否没有选择预约时间或预约日期
        if (this.select_interval_time === '' || this.select_date === '') {
          this.$message.warning('请选择预约日期或预约时间');
          return;
        }
        // 学员第一次预约
        if (this.currentStudentAppoint === null) {
          const { state, message } = await axios.sendRequest({
            url: '/reverse/new',
            method: 'POST',
            data: {
              identify: this.currentStudentInfo.identify,
              name: this.currentStudentInfo.name,
              select_date: this.select_date,
              select_interval_time: this.select_interval_time,
              submit_time: new Date().toLocaleString(),
              coach_id: this.currentStudentInfo.coach_id,
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.$message.success(message);
            await this.getStudentAppoint();
          }
          this.disableAppoint = true;
        } else {
          // 学员第N次预约
          // 判断在预约时间还没有过去时，教练是否确认预约
          if (this.currentStudentAppoint.issure) {
            this.$message.info('教练已确认预约，不可再次预约');
            this.disableAppoint = true;
            await this.getStudentAppoint();
            return;
          }
          const { state, message } = await axios.sendRequest({
            url: '/reverse/update',
            method: 'POST',
            data: {
              id: this.currentStudentAppoint.id,
              select_date: this.select_date,
              select_interval_time: this.select_interval_time,
              submit_time: new Date().toLocaleString(),
            },
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.$message.success(message);
          }
          this.disableAppoint = true;
        }
      } else {
        this.$message.info('请选择开始预约按钮进行预约操作');
      }
    },
    // 删除预约 => 权限验证
    async deleteAppointButton() {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除学员预约时间');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      // 数据处理
      if (this.currentStudentAppoint === null) {
        this.$message.info('目前没有预约');
      } else {
        // 可以删除预约的前提是教练未确认预约
        if (this.currentStudentAppoint.issure) {
          this.$message.info('教练已确认预约，不可删除预约');
        } else {
          this.$confirm('是否删除预约?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger',
          })
            .then(async () => {
              const { state, message } = await axios.sendRequest({
                url: `/reverse/del/${this.currentStudentAppoint.id}`,
                method: 'POST',
              });
              if (state !== 0) {
                this.$message.error(message);
              } else {
                // 清空数据
                this.select_date = '';
                this.select_interval_time = '';
                this.disableAppoint = true;
                this.currentStudentAppoint = null;
                this.$message.success(message);
              }
            })
            .catch(() => {
              this.$message.info('已取消删除');
            });
        }
      }
      this.disableAppoint = true;
    },
    // 获取学员预约数据
    async getStudentAppoint() {
      // 获取后台数据
      const { state, data: reverse } = await axios.sendRequest({ url: '/reverse/detail' });
      if (state === 0) {
        // 对学员预约日期进行处理
        reverse.select_date = new Date(reverse.select_date).toLocaleDateString('fr-CA');
        reverse.submit_time = new Date(reverse.submit_time).toLocaleString();
        this.currentStudentAppoint = reverse;
        this.select_date = this.currentStudentAppoint.select_date;
        this.select_interval_time = this.currentStudentAppoint.select_interval_time;
        // 判断预约日期是否已经过去，若预约时间已过，则可以再次预约
        if (Date.now() > new Date(this.currentStudentAppoint.select_date).getTime()) {
          this.currentStudentAppoint.issure = 0;
        }
      }
    },
  },
  async mounted() {
    // 获取教练安排时间
    const { data: arrange } = await axios.sendRequest({
      url: '/coach/arrange',
      method: 'POST',
    });
    // 若教练未安排练车时间，显示空白信息，学员无法进行预约
    if (!arrange.identify) {
      this.isCoachArranged = false;
      return;
    }
    // 学员预约时间选项进行处理
    this.timePickerOptions = {
      start: arrange.start_time,
      end: arrange.end_time,
      step: arrange.interval_time,
    };
    // 对教练的日期进行处理
    arrange.start_date = new Date(arrange.start_date).toLocaleDateString('fr-CA');
    arrange.end_date = new Date(arrange.end_date).toLocaleDateString('fr-CA');
    this.timeArrangeByCoach = arrange;
    // 获取学员信息
    const { state, message, data } = await axios.sendRequest({
      url: '/student/detail',
      method: 'POST',
    });
    if (state !== 0) {
      this.$message.error(message);
    } else {
      this.currentStudentInfo = data;
    }
    // 获取学员预约信息
    await this.getStudentAppoint();
  },
};
</script>

<style scoped>
.width {
  width: 100%;
  margin-left: 15px;
}
.distance {
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
}
h2 {
  font-weight: 900;
  font-family: "Courier New", Courier, monospace;
  margin-top: 30px;
}
</style>
