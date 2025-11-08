import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), ''); // load all env (including non-VITE_)
    // ensure process.env has our server-side secrets during dev
    process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
    process.env.VITE_DEEPSEEK_BASE_URL = env.VITE_DEEPSEEK_BASE_URL || process.env.VITE_DEEPSEEK_BASE_URL;
    var useProxy = env.VITE_USE_PROXY === '1';
    var baseUrl = env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
    var server = { port: 5175 };
    if (useProxy) {
        server.proxy = {
            '/api/chat': {
                target: baseUrl,
                changeOrigin: true,
                secure: true,
                rewrite: function (path) { return path.replace(/^\/api\/chat$/, '/chat/completions'); },
                configure: function (proxy) {
                    proxy.on('proxyReq', function (proxyReq) {
                        var key = process.env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY || env.VITE_DEEPSEEK_API_KEY;
                        if (key)
                            proxyReq.setHeader('Authorization', "Bearer ".concat(key));
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
        server: server,
    };
});
