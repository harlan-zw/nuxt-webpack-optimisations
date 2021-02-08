import { NuxtWebpackEnv } from '@nuxt/types/config/build'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Module } from '@nuxt/types'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { requireNuxtVersion } from './compatibility'
import type { Options } from './types'

const smp = new SpeedMeasurePlugin({
  outputFormat: 'humanVerbose'
})
const os = require('os')
const cpuCount = os.cpus().length

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
    nuxt.options.build.cache = true

    this.extendBuild((config : WebpackConfig, { isServer, isDev } : ExtendFunctionContext) => {
      // 4 is arbitrary
      if (cpuCount > 4 && !isServer) {
        nuxt.options.build.parallel = true
      }
      if (isDev) {
        nuxt.options.build.transpile = []
        nuxt.options.build.terser = false
        nuxt.options.build.minimize = false
        nuxt.options.build.html.minify = false
        if (isServer) {
          nuxt.options.build.hardSource = true
        }
        nuxt.options.build.babel.presets = (options: NuxtWebpackEnv) => {
          return [
            [
              '@nuxt/babel-preset-app',
              {
                // nuxt.js defaults
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                // use only latest chrome for development
                ignoreBrowserslistConfig: true,
                targets: !options.isServer ? { chrome: 88 } : { node: true },
                // decreases overall package size. See: https://babeljs.io/docs/en/babel-preset-env#bugfixes
                bugfixes: true
              }
            ]
          ]
        }

        if (config.module) {
          // remove the current image loader
          config.module.rules = config.module.rules.filter(
            r => r.test &&
              r.test.toString() !== '/\\.(png|jpe?g|gif|svg|webp)$/i' &&
              r.test.toString() !== '/\\.(png|jpe?g|gif|svg|webp|avif)$/i'
          )
          // inject our new image loader
          config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            use: [
              // we swap out the url-loader with a file-loader in the dev environment for speed
              // large images and files really slow it down
              {
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]',
                  esModule: false
                }
              }
            ]
          })
        }
      }

      if (config.output) {
        config.output.pathinfo = false
        config.output.futureEmitAssets = true
      }
      if (config.resolve) {
        config.resolve.symlinks = false
        config.resolve.cacheWithContext = false
      }
      if (config.optimization && isDev) {
        config.optimization.removeAvailableModules = false
        config.optimization.removeEmptyChunks = false
        config.optimization.splitChunks = false
        config.optimization.runtimeChunk = false
      }
    })

    if (buildOptimisations.measure) {
      nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
        configs.forEach((config) => {
          smp.wrap(config)
        })
      })
    }
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: 'nuxt-build-optimisations' }

export default buildOptimisationsModule
