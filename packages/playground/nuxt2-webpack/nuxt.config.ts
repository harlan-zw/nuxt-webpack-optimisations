import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  target: 'static',
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-webpack-optimisations',
    'nuxt-windicss',
  ],
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  components: true,
}

export default config
