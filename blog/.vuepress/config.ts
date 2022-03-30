import { path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'

module.exports = {
  lang: 'zh-CN',
  title: "imbiansl's space",
  description: "This is imbiansl's space.",
  theme: path.resolve(__dirname, 'theme/index.ts'),

  head: [
    [
      'script',
      {
        src: 'https://kit.fontawesome.com/e1417f4a47.js',
        crossorigin: 'anonymous',
        defer: true,
      },
    ],
  ],

  bundlerConfig: {
    vuePluginOptions: {
      template: {
        compilerOptions: {
          isCustomElement(tag: string) {
            // recognize 'strike' tag
            return ['strike'].indexOf(tag) !== -1
          },
        },
      },
    },
  },

  themeConfig: {},
}
