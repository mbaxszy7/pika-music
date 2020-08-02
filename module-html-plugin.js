const safariFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`

class ModuleHtmlPlugin {
  constructor(isModule) {
    this.isLegacyModule = isModule
  }

  apply(compiler) {
    const id = "ModuleHtmlPlugin"
    compiler.hooks.compilation.tap(id, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        id,
        (data, cb) => {
          data.body.forEach(tag => {
            // add script nomodule/module
            if (tag.tagName === "script") {
              if (/-legacy./.test(tag.attributes.src)) {
                delete tag.attributes.type
                tag.attributes.nomodule = ""
              } else {
                tag.attributes.type = "module"
              }
            }
          })

          if (this.isLegacyModule) {
            // inject Safari 10 nomdoule fix
            data.body.push({
              tagName: "script",
              closeTag: true,
              innerHTML: safariFix,
            })
          }
          cb(null, data)
        },
      )

      // 把<script nomudule=""> 处理成 <script nomudule>
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(id, data => {
        data.html = data.html.replace(/\snomodule="">/g, " nomodule>")
      })
    })
  }
}

module.exports = ModuleHtmlPlugin
