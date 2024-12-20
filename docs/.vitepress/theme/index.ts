import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'

import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin/dist/highlightjs-vue.esm.min.js'

import DocsCodeDemo from './components/docs-code-demo.vue'
import MyLayout from './components/layout.vue'

import directive from './directives'
import './styles/index.scss'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }: { app: App }) {
    app.use(ElementPlus, {
      locale: { ...zhCn }
    })
    app.component('highlightjs', hljsVuePlugin.component)
    app.component('DocsCodeDemo', DocsCodeDemo)

    directive(app)
  }
}
