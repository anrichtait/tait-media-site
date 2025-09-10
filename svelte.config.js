// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'] // No server-side routes needed for static sites
      },
      platformProxy: {
        persist: false // Set to true if you need local development with CF features
      }
    }),
    
    // Pre-render configuration for marketing sites
    prerender: {
      entries: [
        '/',
        '/about',
        '/services',
        '/portfolio', 
        '/contact'
        // Add all your static routes here
      ],
      handleMissingId: 'warn'
    }
  }
};

export default config;
