import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Module } from '@nuxt/types'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { requireNuxtVersion } from './compatibility'
import type { Options } from './types'
import esbuild from './optimisations/esbuild'
import babel from './optimisations/babel'
import images from './optimisations/images'
import webpack from './optimisations/webpack'
import nuxtOptimiser from './optimisations/nuxt'

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

  const profile = buildOptimisations.profile

  requireNuxtVersion(nuxt?.constructor?.version, '2.10')

  nuxt.hook('build:before', () => {
    /* Speed Measure Plugin: https://www.npmjs.com/package/speed-measure-webpack-plugin */
    if (buildOptimisations.measure || process.env.NUXT_MEASURE) {
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
      // replace babel with esbuild
      nuxtOptimiser(profile, nuxt, env)
      // replace babel with esbuild
      esbuild(profile, nuxt, config, env)
      // swap out url-loader for file-loader
      images(config, env)
      // webpack flag optimisations
      webpack(config, env)
      // optimise babel production build
      if (profile !== 'safe') {
        babel(nuxt)
      }
    })
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: 'nuxt-build-optimisations' }

export default buildOptimisationsModule
