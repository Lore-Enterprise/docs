import { create, insert, search } from "@orama/orama";

const DOCS = import.meta.glob('/docs/**/*.{md,mdx}', { as: 'raw' });

export async function useSearch(input: string): Promise<{ file: string, sidebarTitle: string, matchLine: string }[]> {
  const context = await create({
    schema: {
      path: 'string',
      title: 'string',
      content: 'string',
      sidebarTitle: 'string',
      embedding: 'vector[4]'
    }
  });

  const array: { file: string, sidebarTitle: string, matchLine: string }[] = [];

  function cleanup(content: string): string {
    let text = content;

    text = text.replace(/^---[\s\S]*?---\s*/m, '');

    text = text
      .split(/\r?\n/)
      .filter(line => {
        const trimmed = line.trim();
        if (/^<.*?>$/.test(trimmed)) return false;
        return !/^<\/.*?>$/.test(trimmed);
      })
      .join('\n');

    return text;
  }

  for (const path in DOCS) {
    const raw = await DOCS[path]();
    const lines = raw.split(/\r?\n/);

    const sidebarTitle = (() => {
      const line = lines.find(line => line.toLowerCase().startsWith('sidebar-title:'));
      if (!line) return '';
      return line.split(':').slice(1).join(':').trim();
    })();

    const cleanedContent = cleanup(raw);

    await insert(context, {
      path: path,
      title: '',
      content: cleanedContent,
      sidebarTitle,
      embedding: [0, 0, 0, 0]
    });
  }

  const finalizeData = await search(context, {
    term: input,
    properties: ['content', 'sidebarTitle']
  });

  for (const hit of finalizeData.hits) {
    const path = hit.document.path;
    const title = hit.document.sidebarTitle;

    const context = await DOCS[path]();
    const content = cleanup(context);

    const matchedLines = content.split(/\r?\n/).filter(line => line.toLowerCase().includes(input.toLowerCase()));

    for (const line of matchedLines) {
      array.push({ file: path, sidebarTitle: title, matchLine: line.trim() });
    }
  }

  return array;
}