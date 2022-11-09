import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import Login from '../views/Login.vue';
import axios from '../api/axios';

Vue.use(VueRouter);

const Student = () => import(/* webpackChunkName: "Student" */ '../views/Student.vue');
const PersonalStu = () => import(/* webpackChunkName: "PersonalStu" */ '../components/student/Personal.vue');
const StudentAccount = () => import(/* webpackChunkName: "StudentAccount" */ '../components/student/StudentAccount.vue');

const CoachInfo = () => import(/* webpackChunkName: "CoachInfo" */ '../components/student/CoachInfo.vue');
const AppointTrain = () => import(/* webpackChunkName: "AppointTrain" */ '../components/student/AppointTrain.vue');
const ReverseQuery = () => import(/* webpackChunkName: "ReverseQuery" */ '../components/student/ReverseQuery.vue');

const Coach = () => import(/* webpackChunkName: "Coach" */ '../views/Coach.vue');
const Information = () => import(/* webpackChunkName: "Information" */ '../components/coach/Information.vue');
const CoachAccount = () => import(/* webpackChunkName: "CoachAccount" */ '../components/coach/CoachAccount.vue');
const CoachStudent = () => import(/* webpackChunkName: "CoachStudent" */ '../components/coach/CoachStudent.vue');
const CoachCar = () => import(/* webpackChunkName: "CoachCar" */ '../components/coach/CoachCar.vue');
const CarReserve = () => import(/* webpackChunkName: "CarReserve" */ '../components/coach/CarReserve.vue');
const Schedule = () => import(/* webpackChunkName: "Schedule" */ '../components/coach/Schedule.vue');
const StudentAppoint = () => import(/* webpackChunkName: "StudentAppoint" */ '../components/coach/StudentAppoint.vue');

const Backstage = () => import(/* webpackChunkName: "backstage" */ '../views/BackStage.vue');
const User = () => import(/* webpackChunkName: "user" */ '../components/system/user/User.vue');
const Role = () => import(/* webpackChunkName: "Role" */ '../components/system/role/Role.vue');
const Rights = () => import(/* webpackChunkName: "Rights" */ '../components/system/rights/Rights.vue');
const Cars = () => import(/* webpackChunkName: "cars" */ '../components/system/cars/Cars.vue');
const StudentUser = () => import(/* webpackChunkName: "StudentUser" */ '../components/system/control/StudentUser.vue');
const CoachUser = () => import(/* webpackChunkName: "CoachUser" */ '../components/system/coach/CoachUser.vue');
const Vehicle = () => import(/* webpackChunkName: "Vehicle" */ '../components/system/statistics/Vehicle.vue');
const Teaching = () => import(/* webpackChunkName: "Teaching" */ '../components/system/statistics/Teaching.vue');

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录' },
  },
  {
    path: '/student',
    component: Student,
    children: [
      {
        path: '/student',
        name: 'student',
        component: PersonalStu,
        meta: { title: '学员个人信息' },
      },
      {
        path: 'student-account',
        name: 'student-account',
        component: StudentAccount,
        meta: { title: '学员账户信息' },
      },
      {
        path: 'coach-info',
        name: 'coach-info',
        component: CoachInfo,
        meta: { title: '学员教练信息' },
      },
      {
        path: 'appoint-train',
        name: 'appoint-train',
        component: AppointTrain,
        meta: { title: '预约练车时间' },
      },
      {
        path: 'reverse-query',
        name: 'reverse-query',
        component: ReverseQuery,
        meta: { title: '预约情况查询' },
      },
    ],
  },
  {
    path: '/coach',
    component: Coach,
    meta: { title: '教练端' },
    children: [
      {
        path: '/coach',
        name: 'coach',
        component: Information,
        meta: { title: '教练个人信息' },
      },
      {
        path: 'coach-account',
        name: 'coach-account',
        component: CoachAccount,
        meta: { title: '教练账户信息' },
      },
      {
        path: 'coach-student',
        name: 'coach-student',
        component: CoachStudent,
        meta: { title: '教练学员管理' },
      },
      {
        path: 'coach-car',
        name: 'coach-car',
        component: CoachCar,
        meta: { title: '教练车辆查看' },
      },
      {
        path: 'car-reserve',
        name: 'car-reserve',
        component: CarReserve,
        meta: { title: '教练车辆预定' },
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: Schedule,
        meta: { title: '教练时间安排' },
      },
      {
        path: 'student-appoint',
        name: 'student-appoint',
        component: StudentAppoint,
        meta: { title: '学员预约情况' },
      },
    ],
  },
  {
    path: '/admin',
    component: Backstage,
    meta: { title: '后台管理' },
    children: [
      {
        path: '/admin',
        name: 'admin',
        component: User,
        meta: { title: '账户管理' },
      },
      {
        path: 'role',
        name: 'role',
        component: Role,
        meta: { title: '角色管理' },
      },
      {
        path: 'rights',
        name: 'rights',
        component: Rights,
        meta: { title: '权限管理' },
      },
      {
        path: 'cars',
        name: 'cars',
        component: Cars,
        meta: { title: '车辆管理' },
      },
      {
        path: 'coachuser',
        name: 'coachuser',
        component: CoachUser,
        meta: { title: '教练管理' },
      },
      {
        path: 'vehicle',
        name: 'vehicle',
        component: Vehicle,
        meta: { title: '车辆使用统计' },
      },
      {
        path: 'teaching',
        name: 'teaching',
        component: Teaching,
        meta: { title: '教练教学统计' },
      },
      {
        path: 'studentuser',
        name: 'studentuser',
        component: StudentUser,
        meta: { title: '学员管理' },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// 添加一个全局前置路由守卫，除了进入/或/login路径之外，
//  功能1：判断用户是否登录，若登录跳转，没有则跳转到登录页面登录
//  功能2：当用户切换路由时，判断用户是否拥有进入该页面的权限 -- 根据 meta.title 获取权限信息
router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login') {
    // 登录验证
    const { state, message } = await axios.sendRequest({
      url: '/user/validate',
      method: 'POST',
      data: {
        path: to.path,
      },
    });
    if (state === 0) {
      // 进行一级权限的判断
      const { state: status, message: msg } = await axios.sendRequest({
        url: '/authority/detail',
        method: 'POST',
        data: { name: to.meta.title },
      });
      if (status === 0) {
        next();
      } else {
        Message.warning(msg);
      }
    } else {
      Message.warning(message);
      next('/login');
    }
  } else {
    next();
  }
});

// 添加一个全局后置路由守卫，完成修改页面标题
router.afterEach((to, from) => {
  document.title = to.meta.title || '驾校预约管理系统';
});

export default router;
