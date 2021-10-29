const execa = require('execa');
const fs = require('fs')
const path = require('path')

describe('nuxt2-webpack', () => {

  test('build works', async() => {
    // Note: this is a hacky solution
    await execa('yarn', ['run', 'nuxt', 'generate'], { cwd: __dirname });
    expect(fs.existsSync(path.join(__dirname, 'dist', 'index.html'))).toBeTruthy()
  })
})
