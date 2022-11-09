<template>
  <el-card style="height: 100%;">
    <!-- 1.面包屑 -->
    <MyBread url="coach" level1="个人信息" />
    <!-- 2.教练个人信息 -->
    <h2>个人信息展示</h2>
    <el-form
      ref="form"
      :model="CurrentCoachInfo"
      label-width="100px"
      :rules="CoachRules"
    >
      <el-form-item label="姓名">
        <el-input v-model="CurrentCoachInfo.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="性别" >
        <el-radio-group v-model="CurrentCoachInfo.sex" disabled>
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="CurrentCoachInfo.identify" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" >
        <el-input
          v-model="CurrentCoachInfo.phone"
          :disabled="disablePhone"
          prefix-icon="el-icon-phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="预约车辆" v-if="CurrentCoachInfo.reverse_car">
        <el-input v-model="CurrentCoachInfo.reverse_car" readonly></el-input>
      </el-form-item>
      <el-form-item label="教练教龄" >
        <el-input v-model="CurrentCoachInfo.years" readonly></el-input>
      </el-form-item>
    </el-form>
    <div style="float: right">
      <el-button type="primary" @click="updatePhoneButton()" plain round>修改电话</el-button>
      <el-button type="success" @click="savePhoneButton()" plain round>保存电话</el-button>
      <el-button @click="cancelModifyButton()" round>取消修改</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'Information',
  data() {
    return {
      disablePhone: true, // 控制电话输入框禁用
      // 用户表单验证规则
      CoachRules: {
        // 只修改电话，其他内容不需要验证规则
        phone: [{ validator: this.checkPhone, trigger: ['blur', 'change'] }],
      },
      CurrentCoachInfo: {}, // 当前教练信息
    };
  },
  methods: {
    // 修改教练用户信息按钮 => 权限验证 + 输入框使能
    async updatePhoneButton() {
      const { state, message } = await this.SecondaryAuthorityJudgment('修改教练个人信息');
      if (state !== 0) {
        this.$message.warning(message);
        return;
      }
      this.disablePhone = false;
    },
    // 保存修改的个人信息
    savePhoneButton() {
      // 只有在可以修改信息的前提下才能修改信息
      if (!this.disablePhone) {
        // 表单验证
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            // 保存数据到数据库
            const { state, message } = await axios.sendRequest({
              url: '/coach/update',
              method: 'POST',
              data: {
                identify: this.CurrentCoachInfo.identify,
                phone: this.CurrentCoachInfo.phone,
              },
            });
            if (state !== 0) {
              this.$message.error(message);
              this.getCoachInfo();
            } else {
              this.$message.success(message);
            }
            this.disablePhone = true; // 禁用
          } else {
            this.$message.info('表单验证不通过');
          }
        });
      } else {
        this.$message.info('目前信息不可修改，请点击修改信息');
      }
    },
    // 取消修改个人信息
    async cancelModifyButton() {
      if (!this.disablePhone) {
        this.disablePhone = true; // 禁用
        // 恢复修改前的信息，重新获取教练的信息
        this.getCoachInfo();
        this.$message.info('已取消修改');
      }
    },
    getCoachInfo() {
      axios.sendRequest({
        url: '/coach/detail/username',
        method: 'POST',
      }).then(({ data }) => {
        this.CurrentCoachInfo = data;
      });
    },
  },
  mounted() {
    this.getCoachInfo();
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
  color: #555;
}
</style>
