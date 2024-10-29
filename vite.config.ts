import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: env.VITE_BASE_URL, // 使用环境变量来设置基础路径
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});