import { ExtendFunctionContext } from '@nuxt/types/config/module'

export default (profile : string | boolean, nuxt: any, { isDev } : ExtendFunctionContext) => {
  if (profile !== 'safe') {
    nuxt.options.build.cache = true
  }
  if (isDev) {
    // disable modern since the client build will be modern already
    nuxt.options.modern = false
    nuxt.options.build.terser = false
    nuxt.options.build.html.minify = false
    if (profile === 'risky') {
      nuxt.options.build.hardSource = true
      nuxt.options.build.parallel = true
    }
    if (profile !== 'safe') {
      /* No vendor transpiling */
      nuxt.options.build.transpile = []
    }
  }
}
