<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="student" level1="预约情况查询" />
    <!-- 2.空数据图片显示 -->
    <el-empty
      description="还未预约，快去预约吧!"
      v-if="currentStudentAppoint === null"
    ></el-empty>
    <!-- 3.时间线 -->
    <el-timeline v-else style="margin-top: 30px">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :timestamp="activity.timestamp"
        placement="top"
      >
        <el-card>
          <h4>{{ activity.content }}</h4>
          <p>{{ activity.secContent }} {{ activity.timestamp }}</p>
          <p>{{ activity.thrContent }} {{ activity.selectedDate }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'ReverseQuery',
  data() {
    return {
      currentStudentAppoint: null, // 当前学员预约信息
      // 时间线：前两个为已预约但未确认，第三个为确认，第四个为预约时间已过
      activities: [],
    };
  },
  async mounted() {
    // 获取学员预约的信息
    const { state, data: reverse } = await axios.sendRequest({
      url: '/reverse/detail',
    });
    if (state !== 0) {
      this.currentStudentAppoint = null;
      return;
    }
    // 对日期进行处理
    reverse.select_date = new Date(reverse.select_date).toLocaleDateString('fr-CA');
    reverse.submit_time = new Date(reverse.submit_time).toLocaleString();
    if (reverse.confirm_time) {
      reverse.confirm_time = new Date(reverse.confirm_time).toLocaleString();
    }
    this.currentStudentAppoint = reverse;
    // TimeLine 1: 学员预约
    this.activities.push({
      content: '学员预约',
      secContent: '学员 开始于',
      type: 'primary',
      icon: 'el-icon-more',
      timestamp: this.currentStudentAppoint.submit_time,
    });
    // TimeLine 2: 学员提交预约
    this.activities.push({
      content: '学员提交预约',
      secContent: '学员 提交于',
      thrContent: '预约时间 ',
      color: '#13ce66',
      selectedDate: this.currentStudentAppoint.select_date,
      timestamp: this.currentStudentAppoint.submit_time,
    });
    // TimeLine 3: 教练确认预约
    if (this.currentStudentAppoint.issure) {
      this.activities.push({
        content: '教练确认预约',
        secContent: '教练 确认于',
        color: '#13ce66',
        timestamp: this.currentStudentAppoint.confirm_time,
      });
    }
    // 判断预约日期是否已经过去
    const date = new Date(this.currentStudentAppoint.select_date);
    if (Date.now() > date.getTime()) {
      // TimeLine 4: 预约时间结束
      this.activities.push({
        content: '预约结束',
        secContent: '预约 自动结束于',
        thrContent: '可以再次预约 ',
        color: '#ff4949',
        timestamp: this.currentStudentAppoint.select_date,
      });
    }
  },
};
</script>
