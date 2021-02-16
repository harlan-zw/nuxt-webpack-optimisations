import { existsSync } from 'fs'
import { join } from 'upath'
import type { OptimisationArgs } from '../types'

export default ({ options, nuxtOptions, env } : OptimisationArgs) => {
  if (options.profile !== 'safe' && options.features.cacheLoader) {
    nuxtOptions.build.cache = true
  }
  if (options.profile === 'risky') {
    if (!options.measure) {
      if (options.features.hardSourcePlugin) {
        nuxtOptions.build.hardSource = true
      }
      const os = require('os')
      const cpuCount = os.cpus().length
      // check it's worth turning on
      if (cpuCount > 1) {
        nuxtOptions.build.parallel = true
      } else {
        console.info('Not enabling parallel loader due to limited CPU capacity.')
      }
    } else {
      console.info('Parallel loader and hardsource optimisations disabled while `measure` is enabled.')
    }
  }
  if (env.isDev) {
    // disable modern since the client build will be modern already
    nuxtOptions.modern = false
    // disable js minification in dev
    nuxtOptions.build.terser = false
    if (nuxtOptions.build.html) {
      // @ts-ignore
      nuxtOptions.build.html.minify = false
    }
    // set the postcss stage to false to avoid pollyfills
    if (options.features.postcssNoPolyfills &&
      options.profile !== 'safe' &&
      // make sure we have postcss and a preset set
      nuxtOptions.build.postcss &&
      // @ts-ignore
      nuxtOptions.build.postcss.preset
    ) {
      // @ts-ignore
      nuxtOptions.build.postcss.preset.stage = false
    }
  }

  // disable features not used
  // little bit risky because modules could be doing something weird
  if (options.profile !== 'safe') {
    const folderFeatures = [
      'layouts',
      'store'
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
