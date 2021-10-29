import { cpus } from 'os'
import { defineAugmentation, deny } from '../core/util'

const cpuCount = cpus().length

export default defineAugmentation(({ options, logger, nuxtOptions }) => ({

  featureKey: 'parallelPlugin',

  policy() {
    if (cpuCount <= 1)
      return deny('Not enough CPU cores.')

    if (options.measure)
      return deny('optimisations disabled while `measure` is enabled')
  },

  setup() {
    // check it's worth turning on
    nuxtOptions.build.parallel = true
    logger.debug(`thread-loader has ${cpuCount} CPU cores.`)
  },
}))
