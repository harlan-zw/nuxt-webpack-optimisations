import { describe, test, expect } from 'vitest'

const fs = require('fs')
const path = require('path')
const execa = require('execa')
/*
@todo fix
describe('nuxt3-webpack', () => {
  test('build works', async() => {
    // Note: this is a hacky solution
    await execa('pnpm', ['build'], { cwd: __dirname })
    expect(fs.existsSync(path.join(__dirname, '.output', 'public'))).toBeTruthy()
  })
})
*/
