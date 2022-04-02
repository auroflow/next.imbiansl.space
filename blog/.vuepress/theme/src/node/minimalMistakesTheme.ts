import type { Page, Theme } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import anchor from 'markdown-it-anchor'
import { Articles, getPageEntry, MinimalMistakesThemeData, PageEntry } from '../shared'
import mdMathjax from 'markdown-it-mathjax-chtml'
import mdMathjaxSvg from 'markdown-it-mathjax3'
import { MinimalMistakesPageFrontmatter } from '../shared'

const mj = mdMathjax()

const minimalMistakesTheme: Theme<MinimalMistakesThemeData> = (themeConfig, app) => {
  /**
   * Compares two PageEntry on date. If date is the same, compare title
   * @param a
   * @param b
   */
  const compare = (a: PageEntry, b: PageEntry) => {
    const aTime = new Date(a.date).getTime()
    const bTime = new Date(b.date).getTime()
    if (aTime === bTime) {
      return a.title.localeCompare(b.title, app.siteData.lang)
    }
    return aTime - bTime
  }

  /**
   * Check if a page is a post by checking if its path starts with '/posts/'
   * @param page The Page or PageEntry to be checked
   */
  const isPost = (page: Page | PageEntry) => {
    return /^\/posts\/[^/]+/.test(page.path)
  }

  /**
   * Check if a page is in a collection by checking if its path starts with '/collections/'
   * @param page The Page or PageEntry to be checked
   */
  const isInCollection = (page: Page | PageEntry) => {
    return /^\/collections\/[^/]+/.test(page.path)
  }

  /**
   * Get the collection name. It is assumed that `isInCollection(page)` is true.
   * @param page The Page or PageEntry object
   */
  const getCollection = (page: Page | PageEntry) => {
    if ('pathInferred' in page) {
      return page.pathInferred.slice(1).split('/')[1]
    } else {
      return decodeURIComponent(page.path.slice(1).split('/')[1])
    }
  }

  // Make Vue recognize certain custom tags
  // https://github.com/vuepress/vuepress-next/issues/328
  if (app.options.bundler.endsWith('vite')) {
    app.options.bundlerConfig.vuePluginOptions = require('vite').mergeConfig(
      app.options.bundlerConfig.vuePluginOptions,
      {
        template: {
          compilerOptions: {
            isCustomElement(tag: string) {
              // MathJax tag names start with mjx-
              return tag.startsWith('mjx-') || ['small', 'big', 'center'].includes(tag)
            },
          },
        },
      }
    )
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
        md.use(mj.plugin())
      }
    },

    extendsPageOptions: (pageOptions, app) => {
      // page frontmatter is not yet defined

      // default frontmatter
      if (pageOptions.filePath?.startsWith(app.dir.source('posts/'))) {
        // Posts are in /posts
        pageOptions.frontmatter = Object.assign(pageOptions.frontmatter ?? {}, {
          permalinkPattern: 'posts/:year/:month/:day/:slug',
          author: true,
          share: true,
        })
      } else if (pageOptions.filePath?.startsWith(app.dir.source('pages/'))) {
        // Pages are in /pages
        pageOptions.frontmatter = Object.assign(pageOptions.frontmatter ?? {}, {
          author: true,
          permalinkPattern: ':slug',
        })
      } else if (pageOptions.filePath?.startsWith(app.dir.source('collections/'))) {
        // Pages are in /collections
        pageOptions.frontmatter = Object.assign(pageOptions.frontmatter ?? {}, {
          author: true,
          share: true,
        })
      }
    },

    extendsPage(page, app) {
      // page.frontmatter is already defined here

      if (app.env.isBuild && page.frontmatter.mathjax) {
        // add MathJax head tag in build mode
        if (!page.frontmatter.head) page.frontmatter.head = []
        page.frontmatter.head.push([
          'link',
          {
            rel: 'stylesheet',
            href: '/assets/css/mathjax.css',
          },
        ])
      }

      // extract date from filename to frontmatter
      if (page.filePath) {
        const filename = path.basename(page.filePath)
        if (!page.frontmatter.date && /^\d{4}-\d{2}-\d{2}-/.test(filename)) {
          page.frontmatter.date = filename.slice(0, 10)
        }
      }

      // standardize date to string
      if (page.frontmatter.date) {
        page.frontmatter.date = new Date(page.frontmatter.date).toISOString()
      }

      // move single tag or category to their arrays
      if (page.frontmatter.tag) {
        page.frontmatter.tags = [page.frontmatter.tag]
        delete page.frontmatter.tag
      }
      if (page.frontmatter.category) {
        page.frontmatter.categories = [page.frontmatter.category]
        delete page.frontmatter.category
      }

      // tags and categories have to be arrays
      if (page.frontmatter.tags) {
        page.frontmatter.tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags : [page.frontmatter.tags]
      }
      if (page.frontmatter.categories) {
        page.frontmatter.categories = Array.isArray(page.frontmatter.categories)
          ? page.frontmatter.categories
          : [page.frontmatter.categories]
      }
    },

    onInitialized(app) {
      // Get MathJax css
      fs.createFile(app.dir.dest('assets/css/mathjax.css')).then(() => {
        fs.writeFile(app.dir.dest('assets/css/mathjax.css'), mj.getCSS())
      })

      // Get post list
      const articles: Articles = {
        all: [],
        posts: {},
        tags: {},
        categories: {},
        collections: {},
        nav: {},
      }

      for (const page of app.pages) {
        // hidden articles or articles without a date will not be added to any list
        if (page.frontmatter.hidden) continue

        const frontmatter: MinimalMistakesPageFrontmatter = page.frontmatter
        const pageEntry = getPageEntry(page)

        // add to all articles if
        // - it's not a page
        // - it's neither homepage nor 404
        if (!/^\/pages\/.+/.test(page.pathInferred) && !['/', '/404.html'].includes(page.path)) {
          articles.all.push(pageEntry)
        }

        // posts
        if (isPost(page)) {
          // the page is in /posts directory and adheres to the name convention
          const year = parseInt(page.pathInferred.slice(7, 11))
          if (!(year in articles.posts)) {
            articles.posts[year] = []
          }
          articles.posts[year].push(pageEntry)
        }

        // tags
        if (frontmatter.tags) {
          for (const tag of frontmatter.tags) {
            if (!(tag in articles.tags)) {
              articles.tags[tag] = []
            }
            articles.tags[tag].push(pageEntry)
          }
        }

        // categories
        if (frontmatter.categories) {
          for (const category of frontmatter.categories) {
            if (!(category in articles.categories)) {
              articles.categories[category] = []
            }
            articles.categories[category].push(pageEntry)
          }
        }

        // collections
        if (isInCollection(page)) {
          const collection = getCollection(page)
          if (!(collection in articles.collections)) {
            articles.collections[collection] = []
          }
          articles.collections[collection].push(pageEntry)
        }
      }

      // sort all arrays by date
      for (const year in articles.posts) {
        articles.posts[year].sort(compare)
      }
      for (const tag in articles.tags) {
        articles.tags[tag].sort(compare)
      }
      for (const category in articles.categories) {
        articles.categories[category].sort(compare)
      }
      for (const collection in articles.collections) {
        articles.collections[collection].sort(compare)
      }
      articles.all.sort(compare)

      // add prev and next nav to posts and collections
      // these are indexes into articles.all
      let prevPost: number
      let prev: {
        [collection: string]: number
      } = {}

      for (let i = 0; i < articles.all.length; i++) {
        const article = articles.all[i]
        articles.nav[article.key] = {}
        if (isPost(article)) {
          if (prevPost) {
            articles.nav[article.key].prev = {
              path: articles.all[prevPost].path,
              title: articles.all[prevPost].title,
            }
            articles.nav[articles.all[prevPost].key].next = {
              path: article.path,
              title: article.title,
            }
          }
          prevPost = i
        } else if (isInCollection(article)) {
          const collection = getCollection(article)
          if (prev[collection]) {
            articles.nav[article.key].prev = {
              path: articles.all[prev[collection]].path,
              title: articles.all[prev[collection]].title,
            }
            articles.nav[articles.all[prev[collection]].key].next = {
              path: article.path,
              title: article.title,
            }
          }
          prev[collection] = i
        }
      }

      // write to temp file
      app.writeTemp(
        'articles.js',
        `
        export const articles = ${JSON.stringify(articles, (key, value) => {
          if (key === 'pageObject') return undefined
          return value
        })}
        `
      )
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
      ['@vuepress/plugin-shiki', app.env.isBuild ? { theme: 'vitesse-dark' } : false],
      ['@vuepress/plugin-container', { type: 'small' }],
      ['@vuepress/plugin-container', { type: 'notice' }],
      ['@vuepress/plugin-container', { type: 'notice--primary' }],
      ['@vuepress/plugin-container', { type: 'notice--info' }],
      ['@vuepress/plugin-container', { type: 'notice--danger' }],
      ['@vuepress/plugin-container', { type: 'notice--warning' }],
      ['@vuepress/plugin-container', { type: 'notice--success' }],
      ['@vuepress/plugin-container', { type: 'text-left' }],
      ['@vuepress/plugin-container', { type: 'text-right' }],
      ['@vuepress/plugin-container', { type: 'text-center' }],
      ['@vuepress/plugin-container', { type: 'text-justify' }],
      ['@vuepress/plugin-container', { type: 'text-nowrap' }],
    ],
  }
}

export { minimalMistakesTheme }
