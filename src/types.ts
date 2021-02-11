import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { NuxtOptions } from '@nuxt/types'
import type { LoaderOptions, MinifyPluginOptions } from 'esbuild-loader/dist/interfaces'

export interface FeatureFlags {
  babelNotDead: boolean
  esbuildLoader: boolean
  esbuildMinifier: boolean
  imageFileLoader: boolean
  webpackOptimisations: boolean
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
