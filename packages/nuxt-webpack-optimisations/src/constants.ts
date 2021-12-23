import type { ResolvedOptions } from './types'

export const NAME = 'nuxt-webpack-optimisations'
export const NUXT_CONFIG_KEY = 'webpackOptimisations'

export const defaultOptions: ResolvedOptions = {
  profile: undefined,
  debug: false,
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
    modern: {
      target: 'es2015',
    },
  },
  features: {
    postcssNoPolyfills: true,
    esbuildLoader: true,
    esbuildMinifier: true,
    imageFileLoader: true,
    webpackOptimisations: true,
    cacheLoader: true,
    // user has to opt into these
    hardSourcePlugin: false,
    parallelPlugin: false,
  },
}
