<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="css">
*{
  font-weight: 600;
  letter-spacing: 2px;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
/* 关于车辆选中行的字体颜色与背景颜色设置 */
.car-appoint-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.car-appoint-table .el-table__body tr.current-row>td {
  color: #fff;
  background-color: rgb(109, 109, 109)!important;
}
/* 关于学员、教练、管理员的共同样式 */
.box,
.container,
.main {
  height: 100%;
}
.aside {
  background-color: #545c64;
  height: 100%;
  position: relative;
}
.el-main {
  overflow: hidden !important;;
}
/* 学员和教练端的退出按钮样式 */
.logout-button{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50px;
}
/* switch开关文字内容显示在内部 */
.switch .el-switch__label {
  position: absolute;
  display: none;
}
.switch .el-switch__label--right {
  z-index: 1;
  right: -13px;
}
.switch .el-switch__label--left {
  z-index: 1;
  left: 22px;
}
.switch .el-switch__label.is-active {
  display: block;
  color: #fff;
}
.switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 80px !important;
}
</style>
