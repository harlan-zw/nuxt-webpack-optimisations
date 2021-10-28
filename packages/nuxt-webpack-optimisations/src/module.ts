import {
  defineNuxtModule,
  isNuxt2,
  isNuxt3,
} from '@nuxt/kit-edge'
import consola from 'consola'
import { version } from '../package.json'
import { NAME, NUXT_CONFIG_KEY, defaultOptions } from './constants'
import { Augmentation, NuxtWebpackOptimisationOptions } from './types'
import useSpeedMeasurePlugin from './augmentation/useSpeedMeasurePlugin'
import useEsbuildOverBabel from './augmentation/useEsbuildOverBabel'
import useEsbuildMinifier from './augmentation/useEsbuildMinifier'
import useFileLoaderForImagesInDev from './augmentation/useFileLoaderForImagesInDev'
import useGenericWebpackOptimisations from './augmentation/useGenericWebpackOptimisations'
import useDisableModernModeDev from './augmentation/useDisableModernModeDev'
import useNuxtBuildCache from './augmentation/useNuxtBuildCache'
import useNuxtBuildParallel from './augmentation/useNuxtBuildParallel'
import useNuxtBuildHardSource from './augmentation/useNuxtBuildHardSource'
import useDisableDevPostcssPresetEnv from './augmentation/useDisableDevPostcssPresetEnv'

// Should include types only
export * from './types'

export default defineNuxtModule<NuxtWebpackOptimisationOptions>(nuxt => ({
  name: NAME,
  version,
  configKey: NUXT_CONFIG_KEY,
  defaults: {
    root: nuxt.options.rootDir,
    ...defaultOptions,
  },
  async setup(webpackOptimisationOptions: NuxtWebpackOptimisationOptions) {
    const logger = consola.withScope(NAME)

    if (webpackOptimisationOptions.debug) {
      // Debug = 4
      logger.level = 4
    }

    // hacky identification of the nuxt-vite module for Nuxt 2
    // @ts-ignore
    if (isNuxt2(nuxt) && nuxt.options.buildModules.includes('nuxt-vite')) {
      logger.warn(`\`${NAME}\` is enabled with \`nuxt-vite\`. Please remove ${NAME} from your buildModules.`)
      return
    }

    // Make sure they're not using tailwind
    if (isNuxt3(nuxt) && nuxt.options.vite !== false) {
      logger.error(`\`${NAME}\` is only for webpack builds. Please remove ${NAME} from your buildModules.`)
      return
    }

    // await nuxt.callHook('buildOptimisations:options', webpackOptimisationOptions)
    // logger.debug('post `buildOptimisations:options` hook options', webpackOptimisationOptions)

    const augmentations: Record<string, Augmentation> = {
      // run this first
      useSpeedMeasurePlugin,
      // then everything else
      // webpack options
      useEsbuildOverBabel,
      useEsbuildMinifier,
      useFileLoaderForImagesInDev,
      useGenericWebpackOptimisations,
      // nuxt options
      useDisableDevPostcssPresetEnv,
      useDisableModernModeDev,
      useNuxtBuildCache,
      useNuxtBuildParallel,
      useNuxtBuildHardSource,
    }

    Object.values(augmentations)
      .map((fn, i) => {
        const name = Object.keys(augmentations)[i]
        return fn({
          logger,
          name,
          nuxt,
          nuxtOptions: nuxt.options,
          options: webpackOptimisationOptions,
          dev: nuxt.options.dev,
        })
      })
      .forEach((fn, i) => {
        const name = Object.keys(augmentations)[i]
        let disabledReason: string|false = false
        if (typeof fn.dev !== 'undefined') {
          if (fn.dev && !nuxt.options.dev)
            disabledReason = 'dev only'
          else if (!fn.dev && nuxt.options.dev)
            disabledReason = 'non-dev only'
        }
        if (typeof fn.featureKey === 'string') {
          if (!webpackOptimisationOptions.features[fn.featureKey])
            disabledReason = `features.${fn.featureKey} is false`
        }
        if (typeof fn.policy === 'function') {
          const resp = fn.policy()
          if (typeof resp === 'object' && resp.forward === 'deny')
            disabledReason = resp.reason
        }

        if (disabledReason) {
          logger.debug(`\`${name}\` disabled: ${disabledReason}.`)
          return
        }

        logger.debug(`\`${name}\` enabled.`)
        fn.setup()
      })
  },
}))
