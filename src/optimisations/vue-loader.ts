import { RuleSetRule } from 'webpack'
import { OptimisationArgs } from '../types'

export default (args : OptimisationArgs) => {
  const { config } = args
  if (!config.module || !config.plugins) {
    return
  }

  const vueLoaders = config.module.rules.filter(r =>
    // make sure there is a test available
    r.test &&
    // @ts-ignore
    ('.vue'.match(r.test))
  )
  // if for some reason there is no png loader
  if (!vueLoaders.length) {
    return
  }

  const vueLoader = vueLoaders[0] as RuleSetRule
  console.log(vueLoader)
  // remove the current image loader for pngs
  config.module.rules = config.module.rules.filter(item => item !== vueLoader)

  // inject our new image loader
  config.module.rules.push({
    // use the same test, avoid issues
    test: vueLoader.test,
    use: [
      // we swap out the url-loader with a file-loader in the dev environment for speed
      // large images and files really slow it down
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: '/home/harlan/packages/nuxt-build-optimisations/node_modules/.cache/vue-loader',
          cacheIdentifier: '723acb02'
        }
      },
      {
        // @ts-ignore
        loader: vueLoader.loader.toString(),
        options: {
          // @ts-ignore
          ...vueLoader.options,
          compilerOptions: {
            whitespace: 'condense'
          },
          cacheDirectory: '/home/harlan/packages/nuxt-build-optimisations/node_modules/.cache/vue-loader',
          cacheIdentifier: '723acb02'
        }
      }
    ]
  })
}
