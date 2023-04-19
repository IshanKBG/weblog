import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';


export default component$(() => {
  return (
    <>
      Hello
    </>
  );
});

export const head: DocumentHead = {
  title: 'IshanKBG',
  meta: [
    {
      name: 'description',
      content: 'My personal space',
    },
  ],
};
