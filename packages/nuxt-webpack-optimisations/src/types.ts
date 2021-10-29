import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { LoaderOptions, MinifyPluginOptions } from 'esbuild-loader/dist/interfaces'
import type { Nuxt } from '@nuxt/kit-edge'
import { NuxtOptions } from '@nuxt/kit-edge'
import type { Consola } from 'consola'
import { NUXT_CONFIG_KEY } from './constants'

export type WebpackConfigMode = 'client' | 'server' | 'modern'

export type MeasureMode = WebpackConfigMode | 'all'

export type Feature = 'esbuildLoader' | 'esbuildMinifier' | 'imageFileLoader' | 'webpackOptimisations' |
'postcssNoPolyfills' | 'cacheLoader' | 'hardSourcePlugin' | 'parallelPlugin'

export interface ResolvedOptions {
  /**
   * @deprecated Profile is no longer used in v2, use `risky` instead.
   */
  profile: 'risky' | 'experimental' | 'safe' | undefined
  /**
   * Enable logger debug to be displayed/
   */
  debug: boolean
  /**
   * Which webpack config to use with SpeedMeasurePlugin.
   */
  measureMode: MeasureMode
  /**
   * Should SpeedMeasurePlugin run
   */
  measure: boolean | SpeedMeasurePlugin.Options
  /**
   * Options to pass to esbuild-loader for js and ts
   */
  esbuildLoaderOptions: Record<WebpackConfigMode, LoaderOptions>
  /**
   * Options to pass to esbuild-loader for js and ts
   */
  esbuildMinifyOptions: Record<WebpackConfigMode, MinifyPluginOptions>
  /**
   * Which features to run.
   */
  features: Record<Feature, Boolean>
}

export interface NuxtWebpackOptimisationOptions {
  /**
   * @deprecated Profile is no longer used in v2, use `risky` instead.
   */
  profile: 'risky' | 'experimental' | 'safe'
  /**
   * Enable logger debug to be displayed/
   */
  debug?: boolean
  /**
   * Which webpack config to use with SpeedMeasurePlugin.
   */
  measureMode?: MeasureMode
  /**
   * Should SpeedMeasurePlugin run
   */
  measure?: boolean | SpeedMeasurePlugin.Options
  /**
   * Run risky augmentations.
   */
  risky?: false
  /**
   * Options to pass to esbuild-loader for js and ts
   */
  esbuildLoaderOptions?: LoaderOptions|Record<WebpackConfigMode, LoaderOptions>
  /**
   * Options to pass to esbuild-loader for js and ts
   */
  esbuildMinifyOptions?: LoaderOptions|Record<WebpackConfigMode, LoaderOptions>
  /**
   * Which features to run.
   */
  features?: Record<Feature, Boolean>
}

export type AugmentationArgs = {
  logger: Consola
  name: string
  options: ResolvedOptions
  dev: boolean
  nuxt: Nuxt
  nuxtOptions: NuxtOptions
}

export type PolicyResponse = void|boolean|{ forward: 'deny'|'accept'; reason: string }
export type Augmentation = (((args: AugmentationArgs) =>
{ dev?: boolean; featureKey?: Feature; setup: () => void; policy?: () => PolicyResponse}))

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
    'webpackOptimisations:options': (options: ResolvedOptions) => NuxtHookResult
  }
}

// @ts-ignore
declare module '@nuxt/kit' {
  interface NuxtConfig {
    [NUXT_CONFIG_KEY]?: NuxtWebpackOptimisationOptions
  }
  interface NuxtHooks {
    'webpackOptimisations:options': (options: ResolvedOptions) => NuxtHookResult
  }
}
