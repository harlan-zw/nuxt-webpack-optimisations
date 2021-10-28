__![](https://laravel-og.beyondco.de/Nuxt%20Build%20Optimisations.png?theme=light&packageManager=yarn+add&packageName=nuxt-webpack-optimisations&pattern=texture&style=style_1&description=Instantly+speed+up+your+Nuxt+v2+build+times.&md=1&showWatermark=0&fontSize=100px&images=lightning-bolt)

<h1 align='center'><samp>nuxt-webpack-optimisations</samp></h1>

<p align="center">
  <a href="https://github.com/harlan-zw/nuxt-webpack-optimisations/actions"><img src="https://github.com/harlan-zw/nuxt-webpack-optimisations/actions/workflows/test.yml/badge.svg" alt="builder"></a>
  <a href="https://npmjs.com/package/nuxt-webpack-optimisations"><img src="https://img.shields.io/npm/v/nuxt-webpack-optimisations.svg" alt="npm package"></a>
</p>

<p align='center'>Instantly speed up your Nuxt.js v2 build times.</p>


### Can't use Vite with Nuxt yet?

> i.e  [Nuxt Vite](https://vite.nuxtjs.org/) or  [Nuxt 3](https://v3.nuxtjs.org/)

Truly sad... But I do have some good news. While you won't be able to achieve
instant app starts anytime soon, `nuxt-webpack-optimisations` can get things snappy again.

## Webpack Optimisations

`nuxt-webpack-optimisations` is a collection of webpack config changes that will let you speed up your build times and audit them.

By making smarter and riskier assumptions on how you want to run your environment in development, this module
can speed up your development by at least **2x ☃️ cold**, with **"instant" 🔥 hot starts**.

### How risky are we talking

The riskier optimisations are isolated to issues in development around caching being too aggressive, which is always easy to fix with a good old `rm -rf node_modules/.cache` 💩.

✔️ This module has been tested to cause no issues in production environments.

## Features

Features are enabled by their risk profile. The risk profile is the likelihood of issues coming up.

**Tools**

- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)


**Always**
- Nuxt config [build.cache](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#cache) enabled
- Nuxt config [build.parallel](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#parallel) enabled
- webpacks [best practices](https://webpack.js.org/guides/build-performance/)  for performance

**Dev**
- [esbuild](https://esbuild.github.io/) replaces `babel-loader`
- [esbuild](https://esbuild.github.io/) replaces `ts-loader` 
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) is disabled
- `file-loader` replaces `url-loader`
- Nuxt config [build.hardsource](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#hardsource) enabled

**Production**
- [esbuild](https://esbuild.github.io/) replaces [Terser](https://github.com/terser/terser) for minification 


### Compatibility

- ✔️ Nuxt v2
- ✔️ Nuxt bridge
- ✔️ Nuxt 3 (vite needs to be disabled)


## Setup

Install the module.

```bash
yarn add nuxt-webpack-optimisations
# npm i nuxt-webpack-optimisations
```

Within your `nuxt.config.ts` or `nuxt.config.js`
```js
buildModules: [
  'nuxt-webpack-optimisations',
],
```

---

## Usage

The default configuration is the `experimental` profile.

However if you'd like to try and get more performance you can try the following:


```js
// nuxt.config.js
{
  webpackOptimisations: {
    profile: process.env.NODE_ENV === 'development' ? 'risky' : 'experimental'
  }
}
```

A lot of the speed improvements are from heavy caching, if you have any issues the first thing you should
do is clear your cache.

```shell
rm -rf node_modules/.cache

//windows
rd /s  "node_modules/.cache"
```


## Configuration

### Profile

*Type:* `risky` | `experimental` | `safe` | `false`

*Default:* `experimental`

If you have errors on any mode you should increment down in profiles until you find one that works.

Setting the profile to false will disable the optimisations, useful when you want to measure your build time without optimisations.


### Measure

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

### Measure Mode

*Type:* `client` | `server` | `modern` | `all`

*Default:* `client`

Configure which build will be measured. Note that non-client builds may be buggy and mess with HMR.

```javascript
buildOptimisations: {
  measureMode: 'all'
}
```

### Feature Flags

*Type:*  `object`

*Default:*
```js
features: {
// uses esbuild loader
  esbuildLoader: true,
// uses esbuild as a minifier
  esbuildMinifier: true,
// swaps url-loader for file-loader
  imageFileLoader: true,
// misc webpack optimisations
  webpackOptimisations: true,
// no polyfilling css in development
  postcssNoPolyfills: true,
// inject the webpack cache-loader loader
  cacheLoader: true,
// use the hardsource plugin
  hardSourcePlugin: true,
// use the parallel thread plugin
  parallelPlugin: true,
}
```

You can disable features if you'd like to skip optimisations.

```js
buildOptimisations: {
  features: {
    // use url-loader
    imageFileLoader: false
  }
}
```

### esbuildLoaderOptions

*Type:*  `object`

*Default:*
```javascript
{
  target: 'es2015'
}
```

See [esbuild-loader](https://github.com/privatenumber/esbuild-loader).

### esbuildMinifyOptions

*Type:*  `object`

*Default:*
```javascript
{
  target: 'es2015'
}
```

See [esbuild-loader](https://github.com/privatenumber/esbuild-loader).



### Gotchas

#### Vue Property Decorator / Vue Class Component

Your babel-loader will be replaced with esbuild, which doesn't support class decorators in js.

You can either migrate your scripts to typescript or disabled the esbuild loader.

**Disable Loader**
```js
buildOptimisations: {
  features: {
    esbuildLoader: false
  }
}
```

**Migrate to TypeScript**

*tsconfig.json*
```json
{
  "experimentalDecorators": true
}
```

```vue
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  data () {
    return {
      hello: 'test'
    }
  }
}
</script>
```


## Credits

- https://github.com/galvez/nuxt-esbuild-module

## License

[MIT](LICENSE)
