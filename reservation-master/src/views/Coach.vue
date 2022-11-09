<template>
  <div class="box">
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <!-- :default-active="$route.path" 解决了刷新页面不想显示当前激活样式问题 -->
        <el-menu
          :default-active="$route.path"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          style="margin-top: 20px;"
        >
          <el-menu-item index="/coach">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/coach/coach-account">
            <i class="el-icon-user-solid"></i>
            <span>账户信息</span>
          </el-menu-item>
          <el-menu-item index="/coach/coach-student">
            <i class="el-icon-s-custom"></i>
            <span>学员管理</span>
          </el-menu-item>
          <el-menu-item index="/coach/coach-car">
            <i class="el-icon-view"></i>
            <span>车辆查看</span>
          </el-menu-item>
          <el-menu-item index="/coach/car-reserve">
            <i class="el-icon-timer"></i>
            <span>车辆预定</span>
          </el-menu-item>
          <el-menu-item index="/coach/schedule">
            <i class="el-icon-alarm-clock"></i>
            <span>练车时间安排</span>
          </el-menu-item>
          <el-menu-item index="/coach/student-appoint">
            <i class="el-icon-s-order"></i>
            <span>学员预约情况</span>
          </el-menu-item>
        </el-menu>
        <el-button
          type="primary"
          @click="$logout($router)"
          round
          class="logout-button">退出登录</el-button>
      </el-aside>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Coach',
};
</script>
