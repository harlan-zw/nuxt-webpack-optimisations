import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { NuxtOptions } from '@nuxt/types'
import type { LoaderOptions, MinifyPluginOptions } from 'esbuild-loader/dist/interfaces'
import { Consola } from 'consola'

export type RiskProfile = 'risky' | 'experimental' | 'safe'
export type MeasureMode = 'client' | 'server' | 'modern' | 'all'

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
  // use the parallel thread plugin
  parallelPlugin: boolean
}

export interface OptimisationArgs {
  nuxtOptions: NuxtOptions
  // eslint-disable-next-line no-use-before-define
  options: ModuleOptions
  config: WebpackConfig
  logger: Consola
  env: ExtendFunctionContext
}

export interface ModuleOptions {
  measureMode: MeasureMode
  measure: boolean | SpeedMeasurePlugin.Options
  profile: RiskProfile | false
  esbuildLoaderOptions: LoaderOptions | ((args: OptimisationArgs) => LoaderOptions)
  esbuildMinifyOptions: MinifyPluginOptions | ((args: OptimisationArgs) => MinifyPluginOptions)
  features: FeatureFlags
}
