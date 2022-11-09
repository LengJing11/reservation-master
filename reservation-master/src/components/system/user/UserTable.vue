<template>
  <el-table :data="userData" style="width: 100%;" max-height="800">
    <el-table-column type="index" label="#" width="80"></el-table-column>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="password" label="密码"></el-table-column>
    <el-table-column label="角色">
      <template slot-scope="scope">
          <span>{{ handleRole(scope.row.rolename) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建日期" sortable></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.isdel"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="已注销"
          inactive-text="未注销"
          disabled
          class="switch"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="handleEdit(scope.row)"
          style="margin-right: 10px;"
        ></el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-error"
          icon-color="red"
          title="确定删除该用户信息吗？"
          @confirm="handleDelete(scope.row)">
          <el-button
            slot="reference"
            type="danger"
            circle
            icon="el-icon-delete">
          </el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'UserTable',
  props: ['userData', 'handleEdit', 'handleDelete', 'handleRole'],
};
</script>
