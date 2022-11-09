<!-- 学员个人信息页面 -->
<template>
  <el-card style="height: 100%">
    <MyBread url="student" level1="个人信息" />
    <h2>个人信息展示</h2>
    <el-form
      ref="student-form"
      :model="currentStudentInfo"
      label-position="right"
      label-width="100px"
      hide-required-asterisk
      :rules="StudentInfoRules"
    >
      <el-form-item label="姓名">
        <el-input v-model="currentStudentInfo.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="currentStudentInfo.sex" disabled>
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="currentStudentInfo.identify" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="currentStudentInfo.phone"
          :disabled="disablePhoneAndAddress"
          prefix-icon="el-icon-phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="当前住址" prop="address">
        <el-input
          v-model="currentStudentInfo.address"
          :disabled="disablePhoneAndAddress"
          prefix-icon="el-icon-s-home"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请车型">
        <el-input v-model="currentStudentInfo.model" readonly></el-input>
      </el-form-item>
      <el-form-item label="教练姓名">
        <el-input v-model="currentStudentInfo.coach_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="领证日期" v-if="currentStudentInfo.issuance_date">
        <el-date-picker
          v-model="currentStudentInfo.issuance_date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          readonly
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button type="primary" @click="updateUserButton()" plain round>修改信息</el-button>
      <el-button type="success" @click="saveInformationButton()" plain round>保存信息</el-button>
      <el-button @click="cancelModifyButton()" round>取消修改</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'Personal',
  data() {
    return {
      disablePhoneAndAddress: true, // 控制电话和住址输入框的的禁用
      // 表单验证规则 -- 学员表单
      StudentInfoRules: {
        // 姓名，性别，身份证号，申请车型，教练，领证日期 ==> 不可修改(完全只读)，不做验证
        phone: [{ validator: this.checkPhone, trigger: ['blur', 'change'] }],
        address: [{ required: true, message: '住址不能为空', trigger: 'blur' }],
      },
      currentStudentInfo: {},
    };
  },
  methods: {
    // 修改用户信息按钮 => 权限判定 + 输入框使能
    async updateUserButton() {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改学员个人信息');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.disablePhoneAndAddress = false;
    },
    // 保存修改的个人信息 => 修改数据库信息
    saveInformationButton() {
      // 只有在可以修改信息的前提下才能保存信息
      if (this.disablePhoneAndAddress === false) {
        // 表单验证
        this.$refs['student-form'].validate(async (valid) => {
          if (valid) {
            // 修改后台数据
            const { state, message } = await axios.sendRequest({
              url: '/student/update',
              method: 'POST',
              data: {
                identify: this.currentStudentInfo.identify,
                address: this.currentStudentInfo.address,
                phone: this.currentStudentInfo.phone,
              },
            });
            if (state !== 0) {
              // 修改失败，重新修改前的数据并弹框提醒
              this.$message.error(message);
              this.getStudentInfo();
            } else {
              // 修改成功弹框提醒
              this.$message.success(message);
            }
            // 无论修改成功还是失败，输入框都要禁用
            this.disablePhoneAndAddress = true;
          } else {
            this.$message.warning('表单验证不通过');
          }
        });
      } else {
        this.$message.info('目前信息不可修改，请点击修改信息按钮');
      }
    },
    // 取消修改个人信息
    cancelModifyButton() {
      if (this.disablePhoneAndAddress === false) {
        this.disablePhoneAndAddress = true;
        // 重新获取修改前学员的个人信息
        this.getStudentInfo();
        this.$message.info('已取消修改');
      }
    },
    // 获取学员个人信息
    async getStudentInfo() {
      const { data } = await axios.sendRequest({
        url: '/student/detail',
        method: 'POST',
      });
      this.currentStudentInfo = data;
    },
  },
  mounted() {
    this.getStudentInfo();
  },
};
</script>

<style scoped>
h2 {
  font-size: 30px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 30px;
}
</style>
