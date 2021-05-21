const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  pluginOptions: { // 第三方插件配置
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/style/themes.less')] // less所在文件路径
    }
  }
}

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
configureWebpack: {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          // 删除注释
          output: {
            comments: false
          },
          // 删除console debugger 删除警告
          compress: {
            warnings: false,
            drop_console: true, //console
            drop_debugger: false,
            pure_funcs: ['console.log'] //移除console
          }
        }
      })
    ]
  }
}