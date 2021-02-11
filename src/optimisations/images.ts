import { OptimisationArgs } from '../types'

export default ({ config, env, options } : OptimisationArgs) => {
  if (!config.module || !env.isDev || !options.features.imageFileLoader) {
    return
  }
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
