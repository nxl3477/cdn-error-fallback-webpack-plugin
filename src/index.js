const webpack = require('webpack')
const lodash = require('lodash')
const path = require('path')
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const virtualFilesystem = require('./lib/virtual-file-system');
const pluginName = 'CdnErrorFallbackWebpackPlugin'
const CDN_FALLBACK_FILE_NAME = '__CDN_FALLBACK_FILE__'

class CdnErrorFallbackWebpackPlugin {
  
  constructor({ resources = [], inject = 'head' }) {
    if( !['head', 'body'].includes(inject) ) {
      return console.error('Use head or body as inject parameters')
    }
    
    this.inject = inject
    this.resources = resources
  }


  apply(compiler) {

    compiler.hooks.make.tapAsync( pluginName, ( compilation, callback) => {
      const assetsList = this.resources


      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(pluginName, (pluginArgs ) => {
        const injectScripts = []
        let inejctTarget
        if ( this.inject === 'head' ) {
          inejctTarget = pluginArgs.head
        }
        else if ( this.inject === 'body' ) {
          inejctTarget = pluginArgs.body
        }

        let fallbackScriptIndex = pluginArgs.head.findIndex(s => s.tagName === 'script' && s.attributes && s.attributes.src.indexOf(CDN_FALLBACK_FILE_NAME + '.js') > -1)
        let cdnScript

        if( fallbackScriptIndex > -1 ) {
          cdnScript = pluginArgs.head[fallbackScriptIndex]
          pluginArgs.head.splice(fallbackScriptIndex, 1)
          injectScripts.push(cdnScript)
        }else {
          fallbackScriptIndex = pluginArgs.body.findIndex(s => s.tagName === 'script' && s.attributes && s.attributes.src.indexOf(CDN_FALLBACK_FILE_NAME + '.js') > -1)
          cdnScript = pluginArgs.body[fallbackScriptIndex]
          pluginArgs.body.splice(fallbackScriptIndex, 1)
          injectScripts.push(cdnScript)
        }

        assetsList.forEach((_url, cdnIndex) => {
          if( /\.js$/.test(_url[0]) ) {
            injectScripts.push({
              tagName: 'script',
              closeTag: true,
              attributes: {
                type: 'text/javascript',
                src: _url[0],
                onerror: `__CDN_RELOAD__(this, ${cdnIndex})`
              }
            })
          }   
          else if( /\.css$/.test(_url[0]) ) {
            injectScripts.push({
              tagName: "link",
              selfClosingTag: false,
              voidTag: true,
              attributes: {
                href: _url[0],
                rel: "stylesheet",
                onerror: `__CDN_RELOAD__(this, ${cdnIndex})`
              }
            })
          }
          
        })

        inejctTarget.unshift(...injectScripts)
      })

      virtualFilesystem({
        fs: compilation.inputFileSystem,
        modulePath: path.join(__dirname, `./${CDN_FALLBACK_FILE_NAME}.js`),
        contents: `
          window.__CDN_ASSETS_LIST__ = ${JSON.stringify(assetsList)}
          
          window.__CDN_RELOAD_TIMES_MAP__ = {};
          window.__CDN_RELOAD__ = function (domTarget, cdnIndex) {
            var tagName = domTarget.tagName.toLowerCase()
            var getTimes = __CDN_RELOAD_TIMES_MAP__[cdnIndex] === undefined ? ( __CDN_RELOAD_TIMES_MAP__[cdnIndex] = 0 ) : __CDN_RELOAD_TIMES_MAP__[cdnIndex]
            var useCdnUrl = __CDN_ASSETS_LIST__[cdnIndex][++getTimes]
            __CDN_RELOAD_TIMES_MAP__[cdnIndex] = getTimes
            if( tagName === 'script' ) {
              document.write('<script type="text/javascript" src="' + useCdnUrl + '" onerror="__CDN_RELOAD__(this, ' + cdnIndex + ')" ></script>')
            }
            else if( tagName === 'link' ) {
              var newLink = domTarget.cloneNode()
              newLink.href = useCdnUrl
              domTarget.parentNode.insertBefore(newLink, domTarget)
            }
          }
        `
      });

      const name = CDN_FALLBACK_FILE_NAME
      const dep = SingleEntryPlugin.createDependency(path.join(__dirname, `./${CDN_FALLBACK_FILE_NAME}.js`), name);
      compilation.addEntry(undefined, dep, name, callback);
    })
  }
}

module.exports = {
  CdnErrorFallbackWebpackPlugin
}


