import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { type KVNamespace } from '@cloudflare/workers-types';
export const useServerTimeLoader = routeLoader$(async ({ platform }) => {

  const { app } = platform as { app: KVNamespace }
  return {
    message: await app.get('message'),
    date: new Date().toISOString(),
  };
});

export default component$(() => {

  const data = useServerTimeLoader()
  return (
    <main>
      {data.value.message}
      <Slot />
    </main>
  );
});
