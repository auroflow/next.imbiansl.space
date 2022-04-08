import { path } from '@vuepress/utils'
import type { MinimalMistakesThemeData } from './theme/src/shared'

module.exports = {
  lang: 'zh-Hans',
  title: "imbiansl's space",
  description: "This is imbiansl's space.",
  theme: path.resolve(__dirname, 'theme/src/node'),

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

  themeConfig: {
    logo: '',
    fallbackTeaser: '',
    author: {
      name: 'imbiansl',
      home: '/',
      avatar: '/assets/images/avatar.svg',
      bio: "I'm a chameleon.",
      location: 'The earth',
      links: [
        {
          label: 'GitHub',
          icon: 'fa-brands fa-github',
          url: 'https://github.com/golden-flow',
        },
      ],
    },
    header: {
      navigation: [
        {
          url: '/posts/',
          title: 'Posts',
        },
        {
          url: '/tags/',
          title: 'Tags',
        },
        {
          url: '/categories/',
          title: 'Categories',
        },
        {
          url: '/collections/',
          title: 'Collections',
        },
        {
          url: '/posts/2017/07/30/record-of-building-site/',
          title: 'About',
        },
      ],
    },
    footer: {
      feed: '',
      links: [
        {
          label: 'GitHub',
          icon: 'fa-brands fa-github-square',
          url: 'https://github.com/golden-flow',
        },
      ],
    },
    pagination: 10,
  } as MinimalMistakesThemeData,
}
