import { existsSync } from 'fs'
import { cpus } from 'os'
import { join } from 'upath'
import type { OptimisationArgs } from '../types'
import { RISK_PROFILE_SAFE, RISK_PROFILE_RISKY } from '../constants'
import logger from '../logger'

export default ({ options, nuxtOptions, env }: OptimisationArgs) => {
  if (options.profile !== RISK_PROFILE_SAFE && options.features.cacheLoader)
    nuxtOptions.build.cache = true

  if (options.profile === RISK_PROFILE_RISKY) {
    if (!options.measure) {
      if (options.features.hardSourcePlugin)
        nuxtOptions.build.hardSource = true

      if (options.features.parallelPlugin) {
        const cpuCount = cpus().length
        // check it's worth turning on
        if (cpuCount > 1)
          nuxtOptions.build.parallel = true
        else
          logger.warn('Not enabling parallel loader due to limited CPU capacity. Consider disabling `parallelPlugin`.')
      }
    }
    else {
      logger.warn('Parallel loader and hardsource optimisations disabled while `measure` is enabled.')
    }
  }
  if (env.isDev) {
    // disable modern since the client build will be modern already
    nuxtOptions.modern = false
    logger.debug('Nuxt: Disabled modern mode')
    // disable js minification in dev
    nuxtOptions.build.terser = false
    if (nuxtOptions.build.html)
      nuxtOptions.build.html.minify = false

    // set the postcss stage to false to avoid pollyfills
    if (options.features.postcssNoPolyfills
      && options.profile !== RISK_PROFILE_SAFE
      // make sure we have postcss and a preset set
      && nuxtOptions.build.postcss
      // @ts-ignore
      && nuxtOptions.build.postcss.preset
    ) {
      // @ts-ignore
      nuxtOptions.build.postcss.preset.stage = false
    }
  }

  // disable features not used
  // little bit risky because modules could be doing something weird
  if (options.profile !== RISK_PROFILE_SAFE) {
    const folderFeatures = [
      'layouts',
      'store',
    ]
    folderFeatures.forEach((f: string) => {
      // @ts-ignore
      if (nuxtOptions.features[f] && !existsSync(join(nuxtOptions.srcDir, nuxtOptions.dir[f]))) {
        // @ts-ignore
        nuxtOptions.features[f] = false
      }
    })
  }
}
