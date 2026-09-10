import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function adminApiDevPlugin(): Plugin {
  return {
    name: 'admin-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/admin/')) {
          return next();
        }

        let bodyStr = '';
        req.on('data', (chunk) => {
          bodyStr += chunk;
        });

        req.on('end', async () => {
          const pathname = req.url?.split('?')[0];
          let body = {};
          try {
            if (bodyStr) body = JSON.parse(bodyStr);
          } catch {}

          const mockReq = {
            method: req.method,
            headers: req.headers,
            url: req.url,
            body,
            query: Object.fromEntries(new URL(req.url || '', 'http://localhost').searchParams),
          };

          const mockRes = {
            status(code: number) {
              res.statusCode = code;
              return this;
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
          };

          try {
            if (pathname === '/api/admin/login') {
              const handler = (await import('./api/admin/login')).default;
              return handler(mockReq, mockRes);
            }
            if (pathname === '/api/admin/verify') {
              const handler = (await import('./api/admin/verify')).default;
              return handler(mockReq, mockRes);
            }
            if (pathname === '/api/admin/change-password') {
              const handler = (await import('./api/admin/change-password')).default;
              return handler(mockReq, mockRes);
            }
            next();
          } catch (err: any) {
            console.error('Local API Error:', err);
            mockRes.status(500).json({ error: err.message });
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminApiDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
