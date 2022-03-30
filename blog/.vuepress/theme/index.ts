import { Theme } from '@vuepress/core'
import { path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'
import type { MinimalMistakesThemeData } from './types'

const isProd = process.env.NODE_ENV === 'production'

const theme: Theme = {
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
          <i class="fa-solid fa-link" aria-hidden></i>
        `,
      }),
    }
    markdownOptions.extractHeaders = {
      level: [1, 2, 3, 4],
    }
  },

  extendsPageOptions: (pageOptions, app) => {
    if (pageOptions.filePath?.startsWith(app.dir.source('_posts/'))) {
      pageOptions.frontmatter.permalinkPattern = '/:year/:month/:day/:slug.html'
    }
  },

  plugins: [
    [
      '@vuepress/plugin-theme-data',
      // the default theme data object
      {
        themeData: {
          navigation: [
            {
              url: '/',
              title: 'Home',
            },
            {
              url: '/about',
              title: 'About',
            },
            {
              url: '/',
              title: 'Home',
            },
            {
              url: '/about',
              title: 'About',
            },
            {
              url: '/',
              title: 'Home',
            },
            {
              url: '/about',
              title: 'About',
            },
            {
              url: '/',
              title: 'Home',
            },
            {
              url: '/about',
              title: 'About',
            },
          ],
        } as MinimalMistakesThemeData,
      },
    ],
    [
      '@vuepress/plugin-active-header-links',
      {
        headerLinkSelector: 'a.toc__link',
        headerAnchorSelector: 'a.header-link',
        offset: -160,
        delay: 500,
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

module.exports = theme
