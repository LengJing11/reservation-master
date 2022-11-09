<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread
      url="administrator"
      level1="统计分析"
      level2="车辆统计使用情况"
    />
    <!-- 2.车辆使用次数统计 -->
    <div
      ref="vehicle-bars"
      style="width: 100%; height: 80vh; margin-top: 20px"
    ></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import axios from '../../../api/axios';

export default {
  name: 'Vehicle',
  data() {
    return {
      EchartsInstance: null,
    };
  },
  methods: {
    // 分辨率适配
    screenAdapter() {
      const titleFontSize = (this.$refs['vehicle-bars'].offsetWidth / 100) * 3.6;
      const adapterOptions = {
        title: {
          textStyle: {
            fontSize: 30,
          },
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
          },
        },
      };
      this.EchartsInstance.setOption(adapterOptions);
      this.EchartsInstance.resize();
    },
  },
  async mounted() {
    // 获取所有车辆数据
    const { data: array } = await axios.sendRequest({ url: '/car/list' });
    this.EchartsInstance = echarts.init(this.$refs['vehicle-bars']);
    const option = {
      title: {
        text: '▎车辆使用次数统计',
        left: 20,
        top: 20,
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '20%',
        left: '4%',
        right: '10%',
        bottom: '4%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: array.map((item) => item.car_number),
      },
      yAxis: {
        type: 'value',
      },
      series: {
        name: '使用次数',
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          color: '#00ff00', // 文字颜色
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#5052ee' },
            { offset: 1, color: '#ab6ee5' },
          ]),
        },
        data: array.map((item) => item.count),
      },
    };
    this.EchartsInstance.setOption(option);
    this.screenAdapter();
    window.addEventListener('resize', this.screenAdapter);
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter);
  },
};
</script>

<style scoped>
</style>
