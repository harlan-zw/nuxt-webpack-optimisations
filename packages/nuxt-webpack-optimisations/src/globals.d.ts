import { NuxtWebpackOptimisationOptions } from './types'
import { NUXT_CONFIG_KEY } from './constants'

// pollyfill @todo nuxt/kit export
type NuxtHookResult = Promise<void> | void

declare module '@nuxt/types' {
  interface NuxtConfig {
    [NUXT_CONFIG_KEY]?: NuxtWebpackOptimisationOptions
  }
}
declare module '@nuxt/kit-edge' {
  interface NuxtConfig {
    [NUXT_CONFIG_KEY]?: NuxtWebpackOptimisationOptions
  }
  interface NuxtHooks {
    'webpackOptimisations:options': (options: NuxtWebpackOptimisationOptions) => NuxtHookResult
  }
}

// @ts-ignore
declare module '@nuxt/kit' {
  interface NuxtConfig {
    [NUXT_CONFIG_KEY]?: NuxtWebpackOptimisationOptions
  }
  interface NuxtHooks {
    'webpackOptimisations:options': (options: NuxtWebpackOptimisationOptions) => NuxtHookResult
  }
}
