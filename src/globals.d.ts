import { ModuleOptions } from './types'

declare module '@nuxt/types' {
  interface NuxtConfig {
    buildOptimisations: ModuleOptions
  }
}
