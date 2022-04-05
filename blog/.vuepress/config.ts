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
          label: 'Email',
          icon: 'fa-solid fa-envelope',
          url: 'mailto:my@email.com',
        },
        {
          label: 'Twitter',
          icon: 'fa-brands fa-twitter',
          url: 'https://twitter.com',
        },
      ],
    },
    header: {
      navigation: [
        {
          url: '/',
          title: 'Home',
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
          url: '/formatting/',
          title: 'About',
        },
      ],
    },
    footer: {
      feed: '',
      links: [
        {
          label: 'Twitter',
          icon: 'fa-brands fa-twitter-square',
          url: 'https://twitter.com',
        },
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://instagram.com',
        },
        {
          label: 'GitHub',
          icon: 'fa-brands fa-github-square',
          url: 'https://github.com',
        },
      ],
    },
    pagination: 10,
  } as MinimalMistakesThemeData,
}
