# cdn-error-fallback-webpack-plugin
cdn resource loading failure solution

CDN资源加载失败解决方案

# Install

```shell
npm i cdn-error-fallback-webpack-plugin -D
```


# Usage

## example

demo：

```javascript
const { CdnErrorFallbackWebpackPlugin } = require('cdn-error-fallback-webpack-plugin')

module.exports = {
  plugins: [
    new CdnErrorFallbackWebpackPlugin({
      inject: 'head',
      resources: [
        ['https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min222.css', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'],
        ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue2.js', 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js'],
        ['https://cdnjs.cloudflare.com/ajax/libs/vuex/2.5.0/vuex.js', "https://cdnjs.cloudflare.com/ajax/libs/vuex/2.5.0/vuex.js"],
        ['https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.7/vue-router.js', "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.7/vue-router.js"]
      ]
    })
  ]
}
```


## option


### inject
> default = 'head'

The location in the HTML file where the CDN resource is inserted


### resources
> default = []

CDN resource two-dimensional array, in accordance with the array order into the HTML file, when the resource loading failure will try the next index of the resource