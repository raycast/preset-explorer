export function extractPresets<T>(
  els: Element[],
  categories: { slug: string; presets: T[] }[]
) {
  const ids = els.map((v) => v.getAttribute("data-key"));

  const presets = ids
    .map((id) => {
      if (!id) {
        return;
      }
      const [slug, index] = id?.split("-") ?? [];
      const category = categories.find((category) => category.slug === slug);

      return category?.presets[parseInt(index)];
    })
    .filter(Boolean);

  return presets;
}
