/// <reference types="vitest" />
import { resolve } from 'path'
import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'

const r = (p: string) => resolve(__dirname, p)

export const alias: AliasOptions = {
  'nuxt-webpack-optimisations': r('./packages/nuxt-webpack-optimisations'),
}

export default defineConfig({
  test: {
    testTimeout: 1200000,
    include: ['packages/playground/**/*.test.ts'],
  },
  resolve: {
    alias,
  },
})
