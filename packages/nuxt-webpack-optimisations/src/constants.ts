import { NuxtWebpackOptimisationOptions } from './types'

export const NAME = 'nuxt-webpack-optimisations'
export const NUXT_CONFIG_KEY = 'webpackOptimisations'

export const defaultOptions: NuxtWebpackOptimisationOptions = {
  debug: false,
  profile: 'experimental',
  measure: false,
  measureMode: 'all',
  esbuildMinifyOptions: {
    client: {
      target: 'es2015',
    },
    server: {
      target: 'node14',
    },
    modern: {
      target: 'es2015',
    },
  },
  esbuildLoaderOptions: {
    client: {
      target: 'es2015',
    },
    server: {
      target: 'node14',
    },
  },
  features: {
    postcssNoPolyfills: true,
    esbuildLoader: true,
    esbuildMinifier: true,
    imageFileLoader: true,
    webpackOptimisations: true,
    cacheLoader: true,
    hardSourcePlugin: true,
    parallelPlugin: true,
  },
}
