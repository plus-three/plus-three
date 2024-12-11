import { defineConfig, HeadConfig } from 'vitepress'
// import pkg from '../../package.json'

const content = ['plus-three', 'threejs', 'three', 'vue'].toString()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: 'PlusThree',
  description: content,
  head: [
    ['meta', { name: 'author', content: 'xiaofei' }],
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ],
    [
      'meta',
      {
        name: 'description',
        content
      }
    ],
    ['meta', { name: 'keywords', content }],
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  lang: 'zh-CN',
  themeConfig: {
    search: {
      provider: 'local'
    },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outlineTitle: '本页导航',
    lastUpdatedText: '上次更新时间',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '安装',
          link: '/guide/index'
        },
        {
          text: '快速开始',
          link: '/guide/quickstart'
        },
        {
          text: '开发指南',
          link: '/guide/dev'
        },
        {
          text: '贡献指南',
          link: '/guide/contribution'
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/plus-three/plus-three' }],
    footer: {
      message: 'MIT Licensed.',
      copyright: 'Copyright © 2024-present xiaofei'
    },
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/plus-three/plus-three/edit/dev/docs/:path'
    }
  },
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  }
})
