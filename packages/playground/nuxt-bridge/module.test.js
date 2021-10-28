const execa = require('execa');

describe('nuxt-bridge', () => {

  test('index html transformed correctly', async() => {
    // Note: this is a hacky solution
    const res = await execa('yarn', ['run', 'nuxt', 'generate'], { cwd: __dirname });
    console.log(res)
  })
})
