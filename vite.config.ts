import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';

export default defineConfig(({ }) => {
  return {
    plugins: [react()],
    base: '/react-project/', // 使用环境变量来设置基础路径
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});