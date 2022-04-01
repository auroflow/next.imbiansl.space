import type { Theme } from '@vuepress/core'
import { path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'
import type { Articles, MinimalMistakesThemeData } from '../shared'
import mdMathjax from 'markdown-it-mathjax'
import mdMathjaxSvg from 'markdown-it-mathjax3'

const minimalMistakesTheme: Theme<MinimalMistakesThemeData> = (themeConfig, app) => {
  // Make vue recognize certain custom tags
  if (app.options.bundler.endsWith('vite')) {
    app.options.bundlerConfig.viteOptions = require('vite').mergeConfig(app.options.bundlerConfig.viteOptions, {
      isCustomElement(tag: string) {
        // MathJax tag names start with mjx-
        return tag.startsWith('mjx-')
      },
    })
  }

  return {
    name: 'vuepress-theme-minimal-mistakes',

    layouts: {
      Layout: path.resolve(__dirname, '../client/layouts/Layout.vue'),
      default: path.resolve(__dirname, '../client/layouts/DefaultLayout.vue'),
      404: path.resolve(__dirname, '../client/layouts/404.vue'),
    },

    clientAppEnhanceFiles: path.resolve(__dirname, '../client/utils/enhance.ts'),

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
      markdownOptions.code = {
        lineNumbers: 7,
      }
    },

    extendsMarkdown: (md, app) => {
      if (app.env.isDev) {
        md.use(mdMathjaxSvg)
      } else if (app.env.isBuild) {
        md.use(mdMathjax())
      }
    },

    extendsPageOptions: (pageOptions, app) => {
      if (pageOptions.filePath?.startsWith(app.dir.source('posts/'))) {
        // Posts are in /posts
        pageOptions.frontmatter = Object.assign(pageOptions.frontmatter ?? {}, {
          permalinkPattern: 'posts/:year/:month/:day/:slug',
          author: true,
          share: true,
        })
        // extract date from filename to frontmatter
        const possibleDate = path.basename(pageOptions.filePath).slice(0, 10)
        if (possibleDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          pageOptions.frontmatter.date = possibleDate
        }
      } else if (pageOptions.filePath?.startsWith(app.dir.source('pages/'))) {
        // Pages are in /pages
        pageOptions.frontmatter = Object.assign(pageOptions.frontmatter ?? {}, {
          author: true,
          permalinkPattern: ':slug',
        })
      }
    },

    extendsPage(page, app) {
      if (app.env.isBuild && page.frontmatter.mathjax) {
        page.frontmatter = Object.assign(page.frontmatter ?? {}, {
          head: [
            [
              'script',
              {
                id: 'MathJax-script',
                src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
                async: true,
              },
            ],
          ],
        })
      }
    },

    onInitialized(app) {
      // Get post list
      const articles: Articles = {
        posts: [],
      }

      for (const page of app.pages) {
        if (/^\/posts\/\d{4}-\d{2}-\d{2}-/.test(page.pathInferred)) {
          // If the page is in /posts directory and adheres to the name convention,
          // add it to the post list
          articles.posts.push({
            ...page.data,
          })
        }
      }

      console.log(JSON.stringify(articles))
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
      [
        require('../plugins/toc/src/node').default,
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
        app.env.isBuild
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

export { minimalMistakesTheme }
