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
  // inject the webpack cache-loader loader
  cacheLoader: boolean
  // use the hardsource plugin
  hardSourcePlugin: boolean
}

export interface OptimisationArgs {
  nuxtOptions: NuxtOptions
  // eslint-disable-next-line no-use-before-define
  options: ModuleOptions
  config: WebpackConfig
  env: ExtendFunctionContext
}

export interface ModuleOptions {
  measureMode: 'client' | 'server' | 'modern' | 'all'
  measure: boolean | SpeedMeasurePlugin.Options
  profile: 'risky' | 'experimental' | 'safe' | false
  esbuildLoaderOptions: LoaderOptions | ((args: OptimisationArgs) => LoaderOptions)
  esbuildMinifyOptions: MinifyPluginOptions | ((args: OptimisationArgs) => MinifyPluginOptions)
  features: FeatureFlags
}
