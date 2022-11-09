import axios from '../api/axios';

export default {
  install(Vue) {
    // 在Vue原型上添加全局方法 -- 退出登录
    Vue.prototype.$logout = function (_router) {
      Vue.prototype.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          Vue.prototype.$message.success('退出成功!');
          // 页面跳转
          _router.push('/login');
        })
        .catch(() => {
          Vue.prototype.$message.info('已取消退出');
        });
    };
    // 全局混入
    Vue.mixin({
      data() {
        return {
          // 申请车型选项
          options: [
            {
              label: 'C1',
              value: 'C1',
            },
            {
              label: 'C2',
              value: 'C2',
            },
            {
              label: 'A1',
              value: 'A1',
            },
            {
              label: 'A2',
              value: 'A2',
            },
          ],
        };
      },
      methods: {
        // 密码的验证规则
        validatePass(_, value, callback) {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            // 字母、数字、特殊符号：/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/
            // (?![0-9]+$)表示排除掉只有数字的组合
            // (?![a-zA-Z]+$)表示排除掉只有字母的组合
            const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            if (!reg.test(value)) {
              callback(new Error('密码必须包含子母和数字且在6-16位之间'));
            } else {
              callback();
            }
          }
        },
        // 电话的验证规则
        checkPhone(_, value, callback) {
          if (value === '') {
            callback(new Error('电话不能为空'));
          } else {
            const regPhone = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
            if (!regPhone.test(value)) {
              callback(new Error('手机格式不正确'));
            } else {
              callback();
            }
          }
        },
        // 身份证号验证规则
        validateIdentify(_, value, callback) {
          /**
           * 地区：([1-6][1-9]|50)\d{4}  补充重庆地区50
           * 年的前两位：(18|19|20|21) 1800 - 2199
           * 年的后两位：\d{2}
           * 月份：((0[1-9])|10|11|12)
           * 天数：(([0-2][1-9])|10|20|30|31) 闰年不能禁止29+
           * 三围顺序码：\d{3}
           * 校验码：[0-9Xx]
           */
          if (value === '') {
            callback(new Error('身份证号不能为空'));
          } else {
            const regIdentify = /^([1-6][1-9]|50)\d{4}(18|19|20|21)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!regIdentify.test(value)) {
              callback(new Error('身份证号格式不正确'));
            } else {
              callback();
            }
          }
        },
        // 二级权限判断
        async SecondaryAuthorityJudgment(name) {
          const {
            state,
            message,
          } = await axios.sendRequest({
            url: '/authority/detail',
            method: 'POST',
            data: { name },
          });
          return {
            state,
            message,
          };
        },
      },
    });
  },
};
