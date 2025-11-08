import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // load all env (including non-VITE_)
  // ensure process.env has our server-side secrets during dev
  process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
  process.env.VITE_DEEPSEEK_BASE_URL = env.VITE_DEEPSEEK_BASE_URL || process.env.VITE_DEEPSEEK_BASE_URL;
  const useProxy = env.VITE_USE_PROXY === '1';
  const baseUrl = env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
  const server: any = { port: 5175 };
  if (useProxy) {
    server.proxy = {
      '/api/chat': {
        target: baseUrl,
        changeOrigin: true,
        secure: true,
        rewrite: (path: string) => path.replace(/^\/api\/chat$/, '/chat/completions'),
        configure: (proxy: any) => {
          proxy.on('proxyReq', (proxyReq: any) => {
            const key = process.env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY || env.VITE_DEEPSEEK_API_KEY;
            if (key) proxyReq.setHeader('Authorization', `Bearer ${key}`);
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        },
      },
    };
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server,
  };
});
