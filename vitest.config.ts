import { fileURLToPath } from 'node:url';

const config = {
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { include: ['tests/unit/**/*.test.ts'] },
};

export default config;
