import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { NuxtOptions } from '@nuxt/types'

export interface Options {
  measure: boolean | SpeedMeasurePlugin.Options
  profile: 'risky' | 'experimental' | 'safe' | false
}

export interface OptimisationArgs {
  nuxtOptions: NuxtOptions
  options: Options
  config: WebpackConfig
  env: ExtendFunctionContext
}
