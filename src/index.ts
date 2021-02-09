import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Module } from '@nuxt/types'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { requireNuxtVersion } from './compatibility'
import type { OptimisationArgs, Options } from './types'
import * as optimisations from './optimisations'

const buildOptimisationsModule: Module<Options> = function () {
  const { nuxt } = this
  const defaults = {
    measure: false,
    profile: 'experimental'
  } as Options
  const buildOptimisations = {
    ...defaults,
    ...nuxt.options.buildOptimisations
  } as Options

  requireNuxtVersion(nuxt?.constructor?.version, '2.10')

  nuxt.hook('build:before', () => {
    /* Speed Measure Plugin: https://www.npmjs.com/package/speed-measure-webpack-plugin */
    if (process.env.NODE_ENV !== 'test' && (buildOptimisations.measure || process.env.NUXT_MEASURE)) {
      const defaults = {
        outputFormat: 'human'
      }
      const measureOptions = {
        ...defaults,
        ...(typeof buildOptimisations.measure === 'boolean' ? {} : buildOptimisations.measure)
      } as SpeedMeasurePlugin.Options
      const smp = new SpeedMeasurePlugin(measureOptions)
      nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
        configs.forEach((config) => {
          smp.wrap(config)
        })
      })
    }

    this.extendBuild((config: WebpackConfig, env: ExtendFunctionContext) => {
      const args = {
        nuxt,
        config,
        env,
        options: buildOptimisations
      } as OptimisationArgs
      for (const k in optimisations) {
        // @ts-ignore
        optimisations[k](args)
      }
    })
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: 'nuxt-build-optimisations' }

export default buildOptimisationsModule
