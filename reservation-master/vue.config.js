module.exports = {
  lintOnSave: false, // 关于语法检查
  // 配置代理
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
    port: 9088,
    open: true,
  },
};
