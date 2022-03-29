import { usePageData } from '@vuepress/client'
import type { PageHeader } from '@vuepress/client'
import { computed, defineComponent, h, toRefs } from 'vue'
import type { PropType, VNode } from 'vue'
import { routerKey, RouterLink, useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { TocPropsOptions } from '../../shared'

export type TocPropsHeaders = PageHeader[]

export interface TocProps {
  headers: TocPropsHeaders
  options: TocPropsOptions
}

const renderLink = (header: PageHeader, options: TocPropsOptions): VNode => {
  const hash = `#${header.slug}`
  const linkClass = [options.linkClass]

  if (options.linkTag === 'RouterLink') {
    return h(
      RouterLink,
      {
        to: hash,
        class: linkClass,
        ariaLabel: header.title,
      },
      () => header.title
    )
  }

  return h(
    'a',
    {
      href: hash,
      class: linkClass,
      ariaLabel: header.title,
    },
    header.title
  )
}

const renderHeaders = (
  headers: PageHeader[],
  options: TocPropsOptions,
  route: RouteLocationNormalizedLoaded,
  active: boolean = false,
  topHeader: boolean = true
): VNode[] => {
  if (headers.length === 0) {
    return []
  }

  return [
    h(
      'ul',
      {
        class: topHeader ? options.listClass : '',
      },
      headers.map((header) => {
        const hash = `#${header.slug}`
        const itemClass = [options.itemClass]
        let currentActive = active

        // add active class if current item is active
        // or it has an active parent
        if (options.itemActiveClass && (active || route.hash === hash)) {
          itemClass.push(options.itemActiveClass)
          currentActive = true
        }

        return h(
          'li',
          {
            class: itemClass,
          },
          [
            renderLink(header, options),
            renderHeaders(
              header.children,
              options,
              route,
              currentActive,
              false
            ),
          ]
        )
      })
    ),
  ]
}

export const Toc = defineComponent({
  name: 'Toc',

  props: {
    headers: {
      type: Array as PropType<TocPropsHeaders>,
      required: false,
      default: null,
    },

    options: {
      type: Object as PropType<Partial<TocPropsOptions>>,
      required: false,
      default: () => ({}),
    },
  },

  setup(props) {
    const { headers: propsHeaders, options: propsOptions } = toRefs(props)

    const route = useRoute()
    const page = usePageData()
    const headers = computed<TocPropsHeaders>(() => {
      const headersToUse = propsHeaders.value || page.value.headers

      // skip h1 header
      return headersToUse[0]?.level === 1
        ? headersToUse[0].children
        : headersToUse
    })
    const options = computed<TocPropsOptions>(() => ({
      containerTag: 'nav',
      containerClass: 'vuepress-toc',
      listClass: 'vuepress-toc-list',
      itemClass: 'vuepress-toc-item',
      linkTag: 'RouterLink',
      linkClass: 'vuepress-toc-link',
      itemActiveClass: 'active',
      ...propsOptions.value,
    }))

    return () => {
      const renderedHeaders = renderHeaders(headers.value, options.value, route)

      if (options.value.containerTag) {
        return h(
          options.value.containerTag,
          {
            class: options.value.containerClass,
          },
          renderedHeaders
        )
      }

      return renderedHeaders
    }
  },
})
