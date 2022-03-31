import type { Theme } from '@vuepress/core'
import { path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'
import type { MinimalMistakesThemeConfig } from './types'
import mdMathjax from 'markdown-it-mathjax3'

const isProd = process.env.NODE_ENV === 'production'

const theme: Theme<MinimalMistakesThemeConfig> = (themeConfig, app) => {
  return {
    name: 'vuepress-theme-minimal-mistakes',
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
      404: path.resolve(__dirname, 'layouts/404.vue'),
    },
    clientAppEnhanceFiles: path.resolve(__dirname, 'enhance.ts'),

    extendsMarkdownOptions: (markdownOptions, app) => {
      markdownOptions.anchor = {
        level: [1, 2, 3, 4, 5, 6],
        // add permalink header
        permalink: anchor.permalink.linkInsideHeader({
          class: 'header-link',
          symbol: `
          <span class="sr-only">Permalink</span>
          <i class="fa-solid fa-link" aria-hidden="true"></i>
        `,
        }),
      }
      markdownOptions.extractHeaders = {
        level: [1, 2, 3, 4],
      }
    },

    extendsMarkdown: (md) => {
      md.use(mdMathjax, {
        loader: { load: ['input/tex', 'output/chtml'] },
      })
    },

    extendsPageOptions: (pageOptions, app) => {
      if (pageOptions.filePath?.startsWith(app.dir.source('_posts/'))) {
        pageOptions.frontmatter.permalinkPattern = '/:year/:month/:day/:slug.html'
        pageOptions.frontmatter.author = true
      }
    },

    plugins: [
      [
        '@vuepress/plugin-theme-data',
        // the default theme data object
        {
          themeData: {
            ...themeConfig,
          },
        },
      ],
      // [
      //   '@vuepress/plugin-active-header-links',
      //   {
      //     headerLinkSelector: 'a.toc__link',
      //     headerAnchorSelector: 'a.header-link',
      //     offset: 5,
      //     delay: 500,
      //   },
      // ],
      [
        require('./plugins/toc/src/node').default,
        {
          defaultPropsOptions: {
            // the nav container is written by hand in components/TableOfContents.vue
            containerTag: '',
            listClass: 'toc__menu',
            linkClass: 'toc__link',
            itemActiveClass: '',
          },
        },
      ],
      [
        '@vuepress/plugin-shiki',
        isProd
          ? {
              theme: 'vitesse-dark',
            }
          : false,
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'small',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice--primary',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice--info',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice--danger',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice--warning',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'notice--success',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'text-left',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'text-right',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'text-center',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'text-justify',
        },
      ],
      [
        '@vuepress/plugin-container',
        {
          type: 'text-nowrap',
        },
      ],
    ],
  }
}

module.exports = theme
