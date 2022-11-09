<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="admin" level1="系统管理" level2="权限管理" />
    <!-- 2.表格 -->
    <el-table
      :data="RightList"
      border
      max-height="850"
      style="width: 100%; height: 100vh; margin-top: 25px"
    >
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="name" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="权限路径"></el-table-column>
      <el-table-column label="权限级别">
        <template slot-scope="scoped">
          <span v-if="scoped.row.level === 0"
            ><el-tag type="success" effect="dark">一级</el-tag></span
          >
          <span v-if="scoped.row.level === 1"
            ><el-tag type="warning" effect="dark">二级</el-tag></span
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import axios from '../../../api/axios';

export default {
  name: 'Rights',
  data() {
    return {
      RightList: [],
    };
  },
  mounted() {
    // 获取所有权限
    axios.sendRequest({
      url: '/authority/list/only',
    }).then((rows) => {
      // console.log(rows);
      this.RightList = rows.data;
    });
  },
};
</script>
