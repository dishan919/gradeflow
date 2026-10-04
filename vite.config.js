import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'serve' && !isPreview ? '/' : '/gradeflow/',
  esbuild: { jsx: 'automatic' },
}));
