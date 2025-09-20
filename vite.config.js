import { defineConfig } from 'vite';
import nunjucks from 'nunjucks';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig(({ command }) => ({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        contact: resolve(__dirname, 'src/contact.html'),
      },
    },
  },
  plugins: [
    {
      name: 'nunjucks', // chokidar
      buildStart() {
        const env = nunjucks.configure('src/templates', {
          watch: command === 'serve', // watch only during dev
          noCache: true
        });

        const templates = [
          { template: 'main.njk', output: 'src/index.html' },
          { template: 'about.njk', output: 'src/about.html' },
          { template: 'contact.njk', output: 'src/contact.html' }
        ];

        templates.forEach(({ template, output }) => {
          const rendered = env.render(template);
          fs.writeFileSync(output, rendered);
        });
      }
    }
  ],
  server: {
    port: 5757,
    open: true
  }
}));