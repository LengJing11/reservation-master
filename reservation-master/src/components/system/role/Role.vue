<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="admin" level1="系统管理" level2="角色管理"/>
    <!-- 2.表格 -->
    <el-table
      :data="RoleList"
      border
      style="width: 100%; height: 100vh; margin-top: 25px"
      max-height="850"
    >
      <!-- 3.展开行 -->
      <el-table-column type="expand" width="100%">
        <template slot-scope="scoped">
          <el-row v-for="item1 in scoped.row.children" :key="item1.id">
            <el-col :span="4" style="margin-left: 100px">
              <el-tag
                type="success"
                closable
                @close="deleteRightTag(scoped.row, item1)"
              >{{ item1.name }}>
              </el-tag
              >
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="18">
              <el-tag
                type="primary"
                v-for="item2 in item1.children"
                :key="item2.id"
                closable
                @close="deleteRightTag(scoped.row, item2)"
              >{{ item2.name }}>
              </el-tag
              >
            </el-col>
          </el-row>
          <!-- 无权限提示 -->
          <span
            style="margin-left: 50px"
            v-if="scoped.row.children.length === 0"
          >未分配权限</span
          >
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="role_name" label="角色名称"></el-table-column>
      <el-table-column prop="role_name_en" label="角色名称(英文)"></el-table-column>
      <el-table-column prop="role_desc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="modifyRoleInfo(scoped.row)"
          ></el-button>
          <el-button
            type="success"
            size="medium"
            round
            plain
            @click="assignPermissionsButton(scoped.row)"
          >分配权限
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改角色信息对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="dialogVisibleFrom"
      width="440"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        :rules="rules"
        hide-required-asterisk
      >
        <el-form-item prop="authName" label="角色名称">
          <el-input v-model="form.role_name" readonly></el-input>
        </el-form-item>
        <el-form-item prop="authName" label="角色名称">
          <el-input v-model="form.role_name_en" readonly></el-input>
        </el-form-item>
        <el-form-item prop="authDesc" label="角色描述">
          <el-input v-model="form.role_desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="modifyRoleInfoData()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      :title="titlePermissions"
      :visible.sync="dialogVisibleRightsTree"
      width="440"
      class="student_form_item"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        :props="props"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
      >
      </el-tree>
      <div slot="footer">
        <el-button @click="dialogVisibleRightsTree = false;">取 消</el-button>
        <el-button type="primary" @click="confirmAssignPermissions"
        >确 定
        </el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from '../../../api/axios';

export default {
  name: 'Role',
  data() {
    return {
      RoleList: [], // 角色列表
      RightsList: [], // 所有权限列表
      dialogVisibleFrom: false, // 控制表单对话框的显隐
      // 角色信息表单
      form: {
        role_name: '',
        role_name_en: '',
        role_desc: '',
      },
      // 角色表单规则
      rules: {
        role_desc: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur',
          },
        ],
      },
      // 树形组件相关数据
      titlePermissions: '', // 分配权限标题
      dialogVisibleRightsTree: false, // 树形对话框框的显隐
      // 树形组件属性配置
      props: {
        label: 'name',
        children: 'children',
        disabled(data) {
          return !data.isown;
        },
      },
      treeData: [], // 树形组件数据
      checkedKeys: [], // 树形组件默认选中的键
      CurrentRoleInfo: [], // 当前角色信息，包括权限
    };
  },
  methods: {
    // 隐藏对话框
    dialogCancel() {
      this.form = {};// 表单重置
      this.dialogVisibleFrom = false;
    },
    // 获取角色信息
    async getRoleList() {
      // 获取角色信息
      const { data } = await axios.sendRequest({ url: '/role/list' });
      this.RoleList = data;
    },
    // 获取所有权限
    async getAllRights() {
      const { data } = await axios.sendRequest({ url: '/authority/list' });
      this.RightsList = data;
    },
    // 修改角色信息 => 显示对话框 + 权限验证
    async modifyRoleInfo(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改角色');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      // 回滚显示信息
      this.form = row;
      this.dialogVisibleFrom = true;
    },
    // 修改角色信息 -- 修改数据库数据
    modifyRoleInfoData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.dialogVisibleFrom = false;
          const { state, message } = await axios.sendRequest({
            url: '/role/update',
            method: 'POST',
            data: this.form,
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            this.form = {};// 表单重置
            this.$message.success(message);
          }
        } else {
          this.$message.warning('表单验证不通过');
        }
      });
    },

    // 删除标签 => 删除权限 + 权限验证
    async deleteRightTag(row, item) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除角色权限');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          if (item.del === 0 && item.level === 0) {
            this.$message.warning('该一级权限不能删除');
            return;
          }
          // 根据功能判断是否可以删除 -- 若功能是查看则不能删除
          if (item.del === 0 && item.level === 1) {
            this.$message.warning('该二级权限不能删除，请删除对应的一级权限');
            return;
          }
          // 若删除的权限是角色管理或修改角色权限
          if (item.name === '角色管理' || item.name === '添加角色权限') {
            this.$message.warning('该管理员权限不能删除');
            return;
          }
          // 获取删除权限的id
          const keys = [];
          if (item.level === 0) {
            keys.push(item.id);
            const arr = item.children.map((ele) => ele.id);
            keys.push(...arr);
          } else {
            keys.push(item.id);
          }
          // 根据删除的 Tag 删除对应数据，更新数据
          const { state, message } = await axios.sendRequest({
            url: '/authority/del',
            method: 'POST',
            data: keys,
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            await this.getAllRights(); // 重新获取所有权限
            // 实现页面的更新
            const { data } = await axios.sendRequest({ url: '/role/list' });
            data.forEach((d) => {
              if (d.id === row.id) {
                row.children = d.children;
              }
            });
            this.RoleList.forEach((ele) => {
              if (ele.id === row.id) {
                ele.children = row.children;
              }
            });
            this.$message.success(message);
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    // 分配权限 => 对话框
    async assignPermissionsButton(row) {
      const { state, message } = await this.SecondaryAuthorityJudgment('添加角色权限');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.CurrentRoleInfo = row;
      this.RightsList.forEach((item) => {
        if (item.id === row.id) {
          this.treeData = item.children;
          this.titlePermissions = `分配${row.role_name}权限`;
        }
      });
      this.dialogVisibleRightsTree = true;
      // 若角色有权限，获取默认选中键
      if (row.children.length !== 0) {
        const array = [];
        row.children.forEach((item) => {
          array.push(item.id);
          const arr = item.children.map((ele) => ele.id);
          array.push(...arr);
        });
        this.checkedKeys = array;
      }
    },
    // 分配权限 -- 确认分配权限
    async confirmAssignPermissions() {
      // 1.获取树形结构中被选中的或半选的键(id)
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      // 过滤出后添加的权限 id
      const array = keys.filter((key) => this.checkedKeys.indexOf(key) === -1);
      const { state, message } = await axios.sendRequest({
        url: '/authority/new',
        method: 'POST',
        data: array,
      });
      if (state !== 0) {
        this.$message.error(message);
      } else {
        this.dialogVisibleRightsTree = false;
        this.$message.success(message);
        const { data } = await axios.sendRequest({ url: '/role/list' });
        data.forEach((item) => {
          if (item.id === this.CurrentRoleInfo.id) {
            this.CurrentRoleInfo.children = item.children;
          }
        });
      }
    },
  },
  mounted() {
    this.getRoleList();
    this.getAllRights();
  },
};
</script>
