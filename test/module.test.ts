// @ts-nocheck nuxt internals not typed!
import { setupTest, getNuxt } from '@nuxt/test-utils'

const cheerio = require('cheerio')

describe('SSR Dev environment test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true
    }
  })

  // test('options are correct for dev', () => {
  //   const { options } = getNuxt()
  //   expect(getByTestId('smallImg')).toBeDisabled()
  //
  //   expect(options).toContain('Hello World')
  // })
  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="title"]').text().trim()).toEqual('Hello World')
    expect($('[data-testid="smallImg"]').attr('src')).toEqual('/_nuxt/test/fixture/image/small.svg')
    expect($('[data-testid="bigImg"]').attr('src')).toEqual('/_nuxt/test/fixture/image/big.jpg')
  })
})
