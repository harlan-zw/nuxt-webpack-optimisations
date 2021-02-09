import { OptimisationArgs } from '../types'

export default ({ options, nuxt, env } : OptimisationArgs) => {
  if (options.profile !== 'safe') {
    nuxt.options.build.cache = true
  }
  if (env.isDev) {
    // disable modern since the client build will be modern already
    nuxt.options.modern = false
    nuxt.options.build.terser = false
    nuxt.options.build.html.minify = false
    if (options.profile === 'risky') {
      nuxt.options.build.hardSource = true
      nuxt.options.build.parallel = true
    }
    if (options.profile !== 'safe') {
      /* No vendor transpiling */
      nuxt.options.build.transpile = []
    }
  }
}
