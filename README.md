![](https://laravel-og.beyondco.de/Nuxt%20Build%20Optimisations.png?theme=light&packageManager=yarn+add&packageName=nuxt-build-optimisations&pattern=texture&style=style_1&description=Instantly+speed+up+your+Nuxt+v2+build+times.&md=1&showWatermark=0&fontSize=100px&images=lightning-bolt)

<h2 align='center'><samp>nuxt-build-optimisations</samp></h2>

<p align="center">
  <a href="https://github.com/loonpwn/nuxt-build-optimisations/actions"><img src="https://github.com/loonpwn/nuxt-build-optimisations/workflows/ci/badge.svg" alt="builder"></a>
  <a href="https://npmjs.com/package/nuxt-build-optimisations"><img src="https://img.shields.io/npm/v/nuxt-build-optimisations.svg" alt="npm package"></a>
</p>

<p align='center'>Instantly speed up your Nuxt.js v2 build times.</p>


## Why and how fast?

Nuxt.js is fast but is limited by its webpack build, when your app grows things slow down.

Nuxt build optimisations abstracts the complexities of optimising your Nuxt.js app so anyone can instantly speed up their builds
without having to learn webpack. The focus is primarily on the development build, as the optimisations are safer.

### Benchmarks

**Development**: :snowman: **2-5x** quicker cold starts, :fire: almost instant hot starts (with "risky" profile)

**Production**: Should be a slight performance improvement depending on profile.

## Features

The features are separated by their risk profile, how likely they are to cause issues within your app.

**Safe**

- Development: Super quick js/ts transpiling with [esbuild](https://esbuild.github.io/) :zap:
- Development: Images only use `file-loader`
- webpack benchmarking with [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)

**Experimental**
- Development: Disables [postcss-preset-env](https://github.com/csstools/postcss-preset-env) pollyfills
- Replaces [Terser](https://github.com/terser/terser) minification with [esbuild](https://esbuild.github.io/)
- Enable [Nuxt build cache](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#cache)
- webpack's [best practices for performance](https://webpack.js.org/guides/build-performance/)
- Disables Nuxt features that aren't used (layouts, store)

**Risky**
- Enable [Nuxt parallel](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#parallel)
- Enable [Nuxt hard source](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#hardsource)


## Setup

Install using yarn or npm. (Nuxt.js 2.10+ is required)

```bash
yarn add nuxt-build-optimisations
```

```bash
npm i --save-dev nuxt-build-optimisations
```

- :warning: This package makes optimisations with the assumption you're developing on the latest chrome.
- _Note: Nuxt 3 will use Vite which will most likely make this package redundant in the future._

---

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
buildModules: [
  'nuxt-build-optimisations',
],
```

It's recommended you start with the default configuration, which is the `experimental` profile.

However if you'd like to try and get more performance you can try the following:


```js
// nuxt.config.js
buildOptimisations: {
  profile: process.env.NODE_ENV === 'development' ? 'risky' : 'experimental'
},
```

⚠️ Note: The risky profile uses [HardSource](https://github.com/mzgoddard/hard-source-webpack-plugin) caching, if you use it in your production CI with node / npm caching then you need to make sure it caches per branch.

A lot of the speed improvements are from heavy caching, if you have any issues the first thing you should
do is clear your cache.

```shell
rm -rf node_modules/.cache

//windows
rd /s  "node_modules/.cache"
```

# Configuration

## Profile

*Type:* `risky` | `experimental` | `safe` | `false`

*Default:* `experimental`

If you have errors on any mode you should increment down in profiles until you find one that works.

Setting the profile to false will disable the optimisations, useful when you want to measure your build time without optimisations.


## Measure

*Type:* `boolean` or `object`

*Default:* `false`

When measure is enabled with true (options or environment variable), it will use the `speed-measure-webpack-plugin`.

If the measure option is an object it is assumed to be [speed-measure-webpack-plugin options](https://github.com/stephencookdev/speed-measure-webpack-plugin#options).

```js
buildOptimisations: {
  measure: {
    outputFormat: 'humanVerbose',
    granularLoaderData: true,
    loaderTopFiles: 10
  }
}
```

You can use an environment variable to enable the measure as well.

**package.json**

```json
{
  "scripts": {
    "measure": "export NUXT_MEASURE=true; nuxt dev"
  }
}
```

Note: Some features are disabled with measure on, such as caching.

## Measure Mode

*Type:* `client` | `server` | `modern` | `all`

*Default:* `client`

Configure which build will be measured. Note that non-client builds may be buggy and mess with HMR.

```javascript
buildOptimisations: {
  measureMode: 'all'
}
```

## Features

*Type:*  `object`

*Default:*
```js
// uses esbuild loader
esbuildLoader: true
// uses esbuild as a minifier
esbuildMinifier: true
// swaps url-loader for file-loader
imageFileLoader: true
// misc webpack optimisations
webpackOptimisations: true
// no polyfilling css in development
postcssNoPolyfills: true
// inject the webpack cache-loader loader
cacheLoader: boolean
// use the hardsource plugin
hardSourcePlugin: boolean
```

You can disable features if you'd like to skip optimisations.

```shell
buildOptimisations: {
  features: {
    // use url-loader
    imageFileLoader: false
  }
}
```

## esbuildLoaderOptions

*Type:*  `object` or `(args) => object`

*Default:*
```javascript
{
  target: 'es2015'
}
```

See (esbuild-loader)[https://github.com/privatenumber/esbuild-loader].

## esbuildMinifyOptions

*Type:*  `object` or `(args) => object`

*Default:*
```javascript
{
  target: 'es2015'
}
```

See (esbuild-loader)[https://github.com/privatenumber/esbuild-loader].

## Credits

- https://github.com/galvez/nuxt-esbuild-module

## License

[MIT](LICENSE)
