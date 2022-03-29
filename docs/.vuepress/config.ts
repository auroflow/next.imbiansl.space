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

  markdown: {
    anchor: {
      // add permalink header
      permalink: anchor.permalink.linkInsideHeader({
        class: 'header-link',
        symbol: `
          <span class="sr-only">Permalink</span>
          <i class="fa-solid fa-link" aria-hidden></i>
        `,
      }),
    },
  },

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

  plugins: [
    [
      '@vuepress/plugin-active-header-links',
      {
        headerLinkSelector: 'a.toc__link',
        headerAnchorSelector: 'a.header-link',
        offset: -120,
        delay: 0,
      },
    ],
    [
      require('./plugins/toc/src/node').default,
      {
        defaultPropsOptions: {
          // the nav container is written by hand in components/TableOfContents.vue
          containerTag: '',
          listClass: 'toc__menu',
          linkClass: 'toc__link',
          itemActiveClass: 'active',
        },
      },
    ],
    [
      '@vuepress/plugin-shiki',
      {
        theme: 'vitesse-dark',
      },
    ],
  ],
}
