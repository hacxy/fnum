import defineConfig from '@hacxy/eslint-config/nodejs';

export default defineConfig({
  yaml: true,
  ignores: ['scripts/git-hooks/**', 'templates']
});
