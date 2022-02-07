const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { CdnErrorFallbackWebpackPlugin } = require('../src/index')

module.exports = {
  entry: join(__dirname, './test.js'),
  mode: 'production',
  output: {
    publicPath: "/"
  },


  plugins: [
    new CleanWebpackPlugin(),
    new CdnErrorFallbackWebpackPlugin({
      // inject: 'head',
      resources: [
        ['https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min4442.css', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'],
        ['https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min222.css', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'],
        ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue2.js', 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js'],
        ['https://cdnjs.cloudflare.com/ajax/libs/vuex/2.5.0/vuex.js', "https://cdnjs.cloudflare.com/ajax/libs/vuex/2.5.0/vuex.js"],
        ['https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.7/vue-router.js', "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.7/vue-router.js"]
      ]
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(__dirname, './index.html')
    })

  ]
}