import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { Miniflare, LogLevel, Log } from "miniflare"
import tsconfigPaths from 'vite-tsconfig-paths';
async function getMiniflareBindings() {
  const mf = new Miniflare({
    log: new Log(LogLevel.INFO),
    kvPersist: './kv-data', // Use filebase or in memory store
    kvNamespaces: ['app'], //Declare array with NameSpaces
    globalAsyncIO: true,
    globalTimers: true,
    globalRandom: true,

    script: `
		addEventListener("fetch", (event) => {
			event.waitUntil(Promise.resolve(event.request.url));
			event.respondWith(new Response(event.request.headers.get("X-Message")));
		});
		addEventListener("scheduled", (event) => {
			event.waitUntil(Promise.resolve(event.scheduledTime));
		});
		`
  });
  return mf.getBindings()
}

export default defineConfig(async () => {
  return {
    ssr: {
      external: ['@authjs/core']
    },
    plugins: [qwikCity({
      platform: await getMiniflareBindings(),
    }), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
