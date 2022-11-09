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
          style="margin-top: 20px"
        >
          <el-menu-item index="/student">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/student/student-account">
            <i class="el-icon-user-solid"></i>
            <span>账户信息</span>
          </el-menu-item>
          <el-menu-item index="/student/coach-info">
            <i class="el-icon-s-custom"></i>
            <span>教练信息</span>
          </el-menu-item>
          <el-menu-item index="/student/appoint-train">
            <i class="el-icon-alarm-clock"></i>
            <span>预约练车时间</span>
          </el-menu-item>
          <el-menu-item index="/student/reverse-query">
            <i class="el-icon-search"></i>
            <span>预约情况查询</span>
          </el-menu-item>
        </el-menu>
        <el-button
          type="primary"
          @click="$logout($router)"
          round
          class="logout-button"
          >退出登录</el-button>
      </el-aside>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Student',
};
</script>
