<template>
   <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ name: url }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in array" :key="index">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBread',
  props: ['url', 'level1', 'level2', 'level3'],
  data() {
    return {
      array: [],
    };
  },
  mounted() {
    if (this.level1 !== undefined) {
      this.array.push(this.level1);
    }
    if (this.level2 !== undefined) {
      this.array.push(this.level2);
    }
    if (this.level3 !== undefined) {
      this.array.push(this.level3);
    }
  },
};
</script>
<style lang="css">
/* 面包屑样式的全局修改 */
.el-breadcrumb__item .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  font-weight: 600;
  font-size: 18px;
}
.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
  font-size: 18px;
}
</style>
