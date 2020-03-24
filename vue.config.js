module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './public/client/dist/' : '/',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => { 
    config.plugin('html')
    .tap(args => {
        args[0].environment = process.env.NODE_ENV;
        return args;
    });
  },
  configureWebpack: () => { },
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    host: '0.0.0.0',
    port: 8888,
    https: false,
    hotOnly: false,
    open: false,
    proxy: {
      '/api': {
        // 目标 API 地址
        target: 'http://172.16.30.33:9004',
        // 如果要代理 websockets
        ws: false,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true
      }
    },
    before: () => {}
  },
  // eslint-disable-next-line no-dupe-keys
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 配置的格式：import包名: 全局变量
      config.externals = {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'axios': 'axios',
      };

    } else {
      // 为开发环境修改配置...
    }

  },

  // 第三方插件的选项
  pluginOptions: {

  }
}
