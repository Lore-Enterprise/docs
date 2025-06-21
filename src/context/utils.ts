export function extractFrontmatter(raw: string): { data: Record<string, string>, content: string } {
  const match = raw.match(/^---\s*([\s\S]+?)\s*---\s*/)

  if (!match) return { data: {}, content: raw }

  const content = raw.slice(match[0].length)
  const data: Record<string, string> = {}

  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length > 0) {
      data[key.trim()] = rest.join(':').trim()
    }
  }

  return { data, content }
}