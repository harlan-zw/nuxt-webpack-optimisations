import { existsSync } from 'fs'
import { join } from 'upath'
import type { OptimisationArgs } from '../types'

export default ({ options, nuxtOptions, env } : OptimisationArgs) => {
  if (options.profile !== 'safe') {
    nuxtOptions.build.cache = true
  }
  if (options.profile === 'risky') {
    nuxtOptions.build.hardSource = true
    nuxtOptions.build.parallel = true
  }
  if (env.isDev) {
    // disable modern since the client build will be modern already
    nuxtOptions.modern = false
    // disable js minification in dev
    nuxtOptions.build.terser = false
    // @ts-ignore
    nuxtOptions.build.html.minify = false
  }

  // disable features not used
  const folderFeatures = [
    'layouts',
    'store',
    'middleware'
  ]
  folderFeatures.forEach((f : string) => {
    // @ts-ignore
    if (nuxtOptions.features[f] && !existsSync(join(nuxtOptions.srcDir, nuxtOptions.dir[f]))) {
      // @ts-ignore
      nuxtOptions.features[f] = false
    }
  })
}
