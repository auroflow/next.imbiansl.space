import { path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'

module.exports = {
  lang: 'zh-CN',
  title: "imbiansl's space",
  description: "This is imbiansl's space.",
  theme: path.resolve(__dirname, 'theme/index.ts'),

  markdown: {
    anchor: {
      permalink: anchor.permalink.linkInsideHeader({
        class: 'header-link',
        symbol: `
          <span class="sr-only">Permalink</span>
          <i class="fa fa-link"></i>
        `,
      }),
    },
  },
}
