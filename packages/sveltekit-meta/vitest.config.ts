import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['src/lib/components/**', 'dist/**', 'node_modules/**']
    }
  },
  resolve: {
    alias: {
      '$lib': './src/lib'
    }
  }
})