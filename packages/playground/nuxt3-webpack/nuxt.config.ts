import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  mode: 'static',
  static: true,
  vite: false,
  css: [
    '@/css/main.css',
    // '@/css/global.scss',
  ],
  webpackOptimisations: {
    debug: true,
  },
  windicss: {
    analyze: {
      server: {
        port: 4444,
      }
    },
  },
  buildModules: [
    'nuxt-windicss',
    'nuxt-webpack-optimisations',
  ],
})
