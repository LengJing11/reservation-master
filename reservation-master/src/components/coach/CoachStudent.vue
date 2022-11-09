<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="coach" level1="学员管理" />
    <!-- 2.搜索 -->
    <div style="margin-bottom: 25px">
      <el-input
        placeholder="请输入学员姓名"
        v-model="search"
        class="with-input"
        style="margin-top: 30px"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchUser()"
        ></el-button>
      </el-input>
      <el-button type="primary" @click="showAll()">显示所有</el-button>
      <el-button type="primary" @click="showLicence(1)">查看已领证的</el-button>
      <el-button type="primary" @click="showLicence(0)">查看未领证的</el-button>
      <el-button type="primary" @click="reportTeachProgressButton()" plain
        >上报教学进度</el-button
      >
    </div>
    <!-- 3.表格 -->
    <el-table :data="filterData" style="width: 100%;" max-height="800">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" width="100"></el-table-column>
      <el-table-column
        prop="identify"
        label="身份证号"
        width="230"
      ></el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        width="170"
      ></el-table-column>
      <el-table-column
        prop="address"
        label="当前住址"
        width="280"
      ></el-table-column>
      <el-table-column prop="model" label="申请车型"></el-table-column>
      <el-table-column
        prop="issuance_date"
        label="领证日期"
        sortable
      ></el-table-column>
    </el-table>
    <!-- 6.对话框 -->
    <el-dialog
      title="上报教学进度"
      :visible.sync="dialogFormVisible"
      width="440"
    >
      <el-select v-model="TeachingProgress" style="width: 100%">
        <el-option
          v-for="item in SubjectOptions"
          :key="item.progress"
          :label="item.subject"
          :value="item.progress"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReport()">取 消</el-button>
        <el-button type="primary" @click="reportTeachProgress()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'StudentUser',
  data() {
    return {
      currentCoachInfo: {}, // 当前教练信息
      CoachStudentInfo: [], // 呈现所有学员表格
      filterData: [], // 呈现所有学员表格 + 过滤已领证与未领证
      search: '', // 搜索输入框输入的内容 -- 搜索所有
      dialogFormVisible: false, // 上报教学进度
      TeachingProgress: '', // 教学进度 --> 从 【上报教学进度选项】 获取
      // 上报教学进度选项
      SubjectOptions: [
        { subject: '科目一', progress: 1 },
        { subject: '科目二', progress: 2 },
        { subject: '科目三', progress: 3 },
        { subject: '科目四', progress: 4 },
      ],
    };
  },
  methods: {
    // 对话框取消上报教学进度
    cancelReport() {
      this.dialogFormVisible = false;
      this.TeachingProgress = '';
    },
    // 显示所有
    showAll() {
      this.filterData = this.CoachStudentInfo;
    },
    // 过滤已领证与未领证
    showLicence(val) {
      if (val) {
        this.filterData = this.CoachStudentInfo.filter(
          (item) => item.issuance_date,
        );
      } else {
        this.filterData = this.CoachStudentInfo.filter(
          (item) => !item.issuance_date,
        );
      }
    },
    // 搜索功能实现
    searchUser() {
      this.filterData = this.CoachStudentInfo.filter((item) => (
        !this.search
          || item.name.toLowerCase().includes(this.search.toLowerCase())
      ));
      this.search = '';
    },
    // 获取教练信息
    async getCoachInfoId() {
      const { data } = await axios.sendRequest({
        url: '/coach/detail/username',
        method: 'POSt',
      });
      this.currentCoachInfo = data;
      return data.id;
    },
    // 获取学员数据
    async getCoachStudentList() {
      const id = await this.getCoachInfoId();
      axios
        .sendRequest({
          url: `/student/list/${id}`,
          method: 'POST',
        })
        .then(({ data }) => {
          // 对日期进行处理
          data.forEach((element) => {
            if (element.issuance_date) {
              const date = new Date(element.issuance_date);
              element.issuance_date = date.toLocaleDateString('fr-CA');
            }
          });
          this.filterData = this.CoachStudentInfo = data;
        });
    },
    // 上报教学进度按钮 => 验证权限
    async reportTeachProgressButton() {
      const { state, message } = await this.SecondaryAuthorityJudgment('上报教学进度');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.dialogFormVisible = true;
    },
    // 上报教学进度
    async reportTeachProgress() {
      if (this.TeachingProgress !== '') {
        const { state, message } = await axios.sendRequest({
          url: '/coach/update',
          method: 'POST',
          data: {
            identify: this.currentCoachInfo.identify,
            progress: this.TeachingProgress,
          },
        });
        if (state !== 0) {
          this.$message.error(message);
        } else {
          this.$message.success(message);
        }
        this.dialogFormVisible = false;
        this.TeachingProgress = '';
      } else {
        this.$message.warning('教学进度不能为空');
      }
    },
  },
  mounted() {
    this.getCoachStudentList();
  },
};
</script>

<style scoped>
.with-input {
  width: 500px;
  margin-right: 10px;
}
</style>
