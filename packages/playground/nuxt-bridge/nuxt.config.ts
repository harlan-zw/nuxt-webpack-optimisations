// @ts-ignore
import { defineNuxtConfig } from '@nuxt/bridge'
import themeModule from './theme.config.js'

export default defineNuxtConfig({
  target: 'static',
  buildModules: [
    'nuxt-windicss',
    'nuxt-webpack-optimisations',
    themeModule,
  ],
  webpackOptimisations: {
    debug: true,
    features: {
    },
  },
  css: [
    '@/css/main.css',
    '@/css/global.sass',
  ],
  components: true,
})
