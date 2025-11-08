export function extractFirstJsonObject(input: string): any {
  // Strip code fences if present
  const cleaned = input.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found');
  const slice = cleaned.slice(start, end + 1);
  return JSON.parse(slice);
}

