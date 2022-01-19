import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  target: 'static',
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-webpack-optimisations',
    'nuxt-windicss',
  ],
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      },
    },
  },
  windicss: {
    debug: false,
  },
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  components: true,
}

export default config
