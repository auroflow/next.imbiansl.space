import { path } from '@vuepress/utils'

const theme = {
  name: 'vuepress-theme-minimal-mistakes',
  layouts: {
    Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
    404: path.resolve(__dirname, 'layouts/404.vue'),
  },
}

module.exports = theme
