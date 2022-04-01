export interface HeaderNavItem {
  url: string
  description?: string
  title: string
}

export interface LinkItem {
  url: string
  label: string
  icon: string
}

export interface Author {
  name: string
  home: string
  avatar: string
  bio: string
  location: string
  links: LinkItem[]
}

export interface MinimalMistakesThemeConfig {
  logo: string
  fallbackTeaser: string
  author: Author
  header: {
    navigation: HeaderNavItem[]
  }
  footer: {
    feed: string
    links: LinkItem[]
  }
  pagination: number | false
}
