import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { NuxtOptions } from '@nuxt/types'
import type { LoaderOptions, MinifyPluginOptions } from 'esbuild-loader/dist/interfaces'

export interface FeatureFlags {
  // uses esbuild loader
  esbuildLoader: boolean
  // uses esbuild as a minifier
  esbuildMinifier: boolean
  // swaps url-loader for file-loader
  imageFileLoader: boolean
  // misc webpack optimisations
  webpackOptimisations: boolean
  // no polyfilling css in development
  postcssNoPolyfills: boolean
}

export interface ModuleOptions {
  measure: boolean | SpeedMeasurePlugin.Options
  profile: 'risky' | 'experimental' | 'safe' | false
  esbuildLoaderOptions: LoaderOptions
  esbuildMinifyOptions: MinifyPluginOptions
  features: FeatureFlags
}

export interface OptimisationArgs {
  nuxtOptions: NuxtOptions
  options: ModuleOptions
  config: WebpackConfig
  env: ExtendFunctionContext
}
