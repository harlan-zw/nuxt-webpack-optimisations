import type { RuleSetRule } from 'webpack'
import type { OptimisationArgs } from '../types'

export default ({ config, env, options, logger }: OptimisationArgs) => {
  if (!config.module || !env.isDev || !options.features.imageFileLoader)
    return

  const imgLoaders = config.module.rules.filter(r =>
    // make sure there is a test available
    r.test
    // we don't want to match resource queries such as ?inline, it's possible this is nested within oneOf though
    && !r.resourceQuery
    // only basic image formats, we don't want to match svg in case there's a specific svg-loader
    // @ts-ignore
    && ('.png'.match(r.test) || '.jpg'.match(r.test)),
  )
  // if for some reason there is no png loader
  if (!imgLoaders.length)
    return

  // only match the first rule we find
  const firstImgLoader = imgLoaders[0] as RuleSetRule
  // remove the current image loader for pngs
  config.module.rules = config.module.rules.filter(item => item !== firstImgLoader)

  // inject our new image loader
  config.module.rules.push({
    // use the same test, avoid issues
    test: firstImgLoader.test,
    use: [
      // we swap out the url-loader with a file-loader in the dev environment for speed
      // large images and files really slow it down
      {
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          esModule: false,
        },
      },
    ],
  })

  logger.debug('Image loader: Swapped out url-loader with file loader')
}
