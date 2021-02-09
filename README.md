![](https://laravel-og.beyondco.de/Nuxt%20Fast%20Build.png?theme=light&packageManager=vue+add&packageName=import-components&pattern=texture&style=style_1&description=Automatically+speed+up+your+Nuxt+build+time.&md=1&showWatermark=0&fontSize=100px&images=collection)

<h2 align='center'><samp>nuxt-fast-build</samp></h2>

<p align='center'>Automatically speed up your Nuxt.js 2 build time.</p>


## Why and How?

Nuxt Build Optimisations is for modern, sluggish Nuxt.js 2 apps.

it makes smart assumptions about trade-offs you're willing to make for better build speeds.

Under the hood it modifies your Nuxt config and the underlying webpack config.

*:warning: This module is experimental. You need to test your app with it before it hits production.*

## Features

- :snail: Find what is slowing down your app with [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)
- :mage: webpacks [best practices for performance](https://webpack.js.org/guides/build-performance/)

**Development**
- :zap: Transpile js/ts with esbuild
- :zap: Quicker loader for images

**Production**
- :skull: Transpile for non-dead browsers

## Setup

Install using yarn or npm. (Nuxt.js 2.10+ is required)

```bash
yarn add nuxt-build-optimisations
```

---

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
buildModules: [
  'nuxt-build-optimisations',
],
```

To enable the measure plugin, you can use an environment variable or follow the documentation below.

**package.json**

```json
{
  "scripts": {
    // ...
    "measure": "export NUXT_MEASURE=true; nuxt dev"
  }
}
```

## Configuration

Configuration is under the buildOptimisations key in your nuxt.config.js.

**Default Configuration**
```js
buildOptimisations: {
  profile: 'risky'
}
```


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


# Profile

*Type:* `risky` | `experimental` | `safe` | `false`

*Default:* `risky`

If you have errors on the `risky` mode you should increment down in profiles until you find one that works.

Setting the profile to false will disable the optimisations, useful when you want to measure your old runtime.

## Safest

### Faster image loader

Development only

Swaps `url-loader` for `file-loader`. Faster when you have a lot of images of varying sizes.

Tradeoff: can't test url-loaded images in dev 

### Webpack flag optimisations

Specific webpack flags changed based on best practices described in the documentation.

Tradeoff: See webpack docs

### Disable minimising

Development only

Makes sure all Nuxt minimising is disabled to speed up builds, including js and html.

### No local modern builds

Development only

Modern builds are disabled by default as the main client build works the same.

## Experimental

### Optimised Transpiling

For development will only transpile code to the latest chrome for a ~40% quicker compile.

In production transpiles code for non-dead browsers. Nuxt out of the box transpiles to IE9. See: https://github.com/browserslist/browserslist#full-list

### Cache enabled

Nuxt cache option enabled

### No vendor transpiling

Development only

Removes any transpiling of third party libraries. 

## Risky

### Hard Source Enabled

Nuxt hardSource enabled

### Parallel Enabled

Nuxt parallel enabled

## License

[MIT](LICENSE)
