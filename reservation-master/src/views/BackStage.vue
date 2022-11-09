<template>
  <div class="box">
    <el-container class="container">
      <el-container>
        <el-aside class="aside" width="200px">
          <!-- :default-active="$route.path" 解决了刷新页面不想显示当前激活样式问题 -->
          <el-menu
            :default-active="$route.path"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item index="/admin">
                <i class="el-icon-s-custom"></i>
                <span>账户管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/role">
                <i class="el-icon-user-solid"></i>
                <span>角色管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/rights">
                <i class="el-icon-s-check"></i>
                <span>权限管理</span>
              </el-menu-item>
              <el-submenu index="1-4">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>控制面板</span>
                </template>
                <el-menu-item index="/admin/studentuser">
                  <i class="el-icon-user"></i>
                  <span>学员管理</span>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="/admin/cars">
              <i class="el-icon-bicycle"></i>
              <span>车辆管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/coachuser">
              <i class="el-icon-user"></i>
              <span>教练员管理</span>
            </el-menu-item>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>统计分析</span>
              </template>
              <el-menu-item index="/admin/vehicle">
                <i class="el-icon-data-analysis"></i>
                <span>车辆使用</span>
              </el-menu-item>
              <el-menu-item index="/admin/teaching">
                <i class="el-icon-data-analysis"></i>
                <span>教练教学</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <el-button
          type="primary"
          @click="$logout($router)"
          round
          class="logout-button">退出登录</el-button>
        </el-aside>
        <el-main class="main"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'BackStage',
};
</script>
