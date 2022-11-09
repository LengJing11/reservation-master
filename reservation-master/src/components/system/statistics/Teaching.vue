<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread
      url="administrator"
      level1="统计分析"
      level2="教练教学进度统计"
    />
    <!-- 2.教练教学进度 -->
    <div
      ref="teaching-bars"
      style="width: 100%; height: 80vh; margin-top: 25px"
    ></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import axios from '../../../api/axios';

export default {
  name: 'Teaching',
  data() {
    return {
      EchartsInstance: null, // ECharts实例对象
      AllCoachData: null, // 所有教练数据
      // 动态属性的实现
      CurrentPage: 1, // 当前页面
      TotalPage: 0, // 总页面
      TimerId: null, // 定时器标识
    };
  },
  methods: {
    // 初始化图表
    initECharts() {
      this.EchartsInstance = echarts.init(this.$refs['teaching-bars']);
      // 对图表对象进行鼠标事件的监听
      this.EchartsInstance.on('mouseover', () => {
        clearInterval(this.TimerId);
      });
      this.EchartsInstance.on('mouseout', () => {
        this.startInterval();
      });
    },
    // 获取并处理后台数据
    async getAndHandleData() {
      const { data: CoachData } = await axios.sendRequest({
        url: '/coach/list',
        method: 'POST',
      });
      this.AllCoachData = CoachData;
      // 进行分页处理
      this.TotalPage = this.AllCoachData.length % 5 === 0
        ? this.AllCoachData.length / 5
        : this.AllCoachData.length / 5 + 1;
      this.updateECharts();
      this.startInterval();
    },
    // 更新图表
    updateECharts() {
      const ShowData = this.AllCoachData.slice(
        (this.CurrentPage - 1) * 5,
        this.CurrentPage * 5,
      );
      const TeachingProgress = []; // 教学进度（科目...）
      const TeachingProgressPercentage = []; // 教学进度（百分比）
      const TeachingProgressPercentageAll = new Array(ShowData.length).fill(
        100,
      ); // 总进度（百分比）
      const progress = ShowData.map((item) => item.progress);
      progress.forEach((item) => {
        if (item === 0) {
          TeachingProgress.push('未开始');
          TeachingProgressPercentage.push(0);
        } else if (item === 1) {
          TeachingProgress.push('科目一');
          TeachingProgressPercentage.push(25);
        } else if (item === 2) {
          TeachingProgress.push('科目二');
          TeachingProgressPercentage.push(50);
        } else if (item === 3) {
          TeachingProgress.push('科目三');
          TeachingProgressPercentage.push(75);
        } else if (item === 4) {
          TeachingProgress.push('科目四');
          TeachingProgressPercentage.push(100);
        }
      });
      // 随机显示颜色
      const colors = [];
      for (let index = 0; index < ShowData.length; index++) {
        colors.push(`#${Math.floor(Math.random() * 0xffffff)
          .toString(16)}`);
      }
      const option = {
        title: {
          text: '▎教练教学情况统计表',
          textStyle: {
            fontSize: 30,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: '1%',
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          show: false, // 不显示x轴相关信息
        },
        yAxis: [
          {
            type: 'category',
            // 教练名
            data: ShowData.map((item) => item.name),
            axisTick: { show: false }, // 不显示刻度线
            axisLabel: {
              color: '#000',
            },
            axisLine: {
              show: false,
            },
            inverse: true,
          },
          {
            type: 'category',
            // 教练进度（科目...）
            data: TeachingProgress,
            axisTick: { show: false }, // 不显示刻度线
            axisLabel: {
              color: '#000',
            },
            axisLine: {
              show: false,
            },
            inverse: true,
          },
        ],
        series: [
          {
            name: '已完成',
            yAxisIndex: 0,
            type: 'bar',
            // 教练进度（百分比）
            data: TeachingProgressPercentage,
            // 修改第一条柱子的圆角
            itemStyle: {
              borderRadius: 20,
              color(params) {
                // params 传递过来的柱子对象
                // dataIndex 是当前柱子的索引
                const num = colors.length;
                return colors[params.dataIndex % num];
              },
              // color 可以修改柱子的颜色
              // color: "orange",
            },
            // 柱子之间的间距
            barCategoryGap: 1,
            // 柱子之间的宽度
            barWidth: 20,
            // 显示柱子内的文字
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
              // {c} 会自动解析为data中的数据
            },
          },
          {
            name: '总进度',
            yAxisIndex: 1,
            type: 'bar',
            data: TeachingProgressPercentageAll,
            // 柱子之间的间距
            barCategoryGap: 5,
            // 柱子之间的宽度
            barWidth: 20,
            itemStyle: {
              color: 'none', // 填充色
              borderColor: '#00f',
              borderWidth: 2,
              barBorderRadius: 15,
            },
          },
        ],
      };
      this.EchartsInstance.setOption(option);
    },
    // 开启定时器，每隔3秒更新切换数据
    startInterval() {
      if (this.TimerId) {
        clearInterval(this.TimerId);
      }
      this.TimerId = setInterval(() => {
        this.CurrentPage++;
        if (this.CurrentPage > this.TotalPage) {
          this.CurrentPage = 1;
        }
        this.updateECharts();
      }, 3000);
    },
  },
  mounted() {
    this.initECharts();
    this.getAndHandleData();
  },
  destroyed() {
    // 页面销毁移除定时器
    clearInterval(this.TimerId);
  },
};
</script>
