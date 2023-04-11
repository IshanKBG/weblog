
export const fetcher = async (
  url: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1]
): ReturnType<typeof fetch> => {
  const res = await fetch(url, {
    ...init, next: {
      revalidate: 9
    }
  });
  return res.clone();
}
