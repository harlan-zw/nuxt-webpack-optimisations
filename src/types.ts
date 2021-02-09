import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'

export interface Options {
  measure: boolean | SpeedMeasurePlugin.Options
  profile: 'risky' | 'experimental' | 'safe' | false
}

export interface OptimisationArgs {
  nuxt: any
  options: Options
  config: WebpackConfig
  env: ExtendFunctionContext
}
