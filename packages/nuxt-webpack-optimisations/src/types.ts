import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import type { LoaderOptions, MinifyPluginOptions } from 'esbuild-loader/dist/interfaces'
import type { Nuxt } from '@nuxt/kit-edge'
import { NuxtOptions } from '@nuxt/kit-edge'
import type { Consola } from 'consola'

export type RiskProfile = 'risky' | 'experimental' | 'safe'
export type MeasureMode = 'client' | 'server' | 'modern' | 'all'

export type Feature = 'esbuildLoader' | 'esbuildMinifier' | 'imageFileLoader' | 'webpackOptimisations' |
'postcssNoPolyfills' | 'cacheLoader' | 'hardSourcePlugin' | 'parallelPlugin'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export interface NuxtWebpackOptimisationOptions {
  debug: boolean
  measureMode: MeasureMode
  measure: boolean | SpeedMeasurePlugin.Options
  profile: RiskProfile | false
  esbuildLoaderOptions: PartialRecord<'client'|'server'|'modern', LoaderOptions>
  esbuildMinifyOptions: PartialRecord<'client'|'server'|'modern', MinifyPluginOptions>
  features: Record<Feature, Boolean>
}

export type AugmentationArgs = {
  logger: Consola
  name: string
  options: NuxtWebpackOptimisationOptions
  dev: boolean
  nuxt: Nuxt
  nuxtOptions: NuxtOptions
}

export type PolicyResponse = void|boolean|{ forward: 'deny'|'accept'; reason: string }
export type Augmentation = (((args: AugmentationArgs) =>
{ dev?: boolean; featureKey?: Feature; setup: () => void; policy?: () => PolicyResponse}))
