/* Run with `npm run words:validate`. Checks the dataset before it ships. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const path = fileURLToPath(new URL('../src/data/words.json', import.meta.url))
const words = JSON.parse(readFileSync(path, 'utf8')) as Array<Record<string, unknown>>

const CATEGORIES = ['comune', 'letteraria', 'scientifica', 'antica', 'regionale', 'straniera']
const errors: string[] = []
const seen = new Set<string>()

words.forEach((w, i) => {
  const at = `#${i} (${String(w.term ?? '??')})`
  const id = w.id
  if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) errors.push(`${at}: id mancante o non slug`)
  else if (seen.has(id)) errors.push(`${at}: id duplicato "${id}"`)
  else seen.add(id as string)

  if (typeof w.term !== 'string' || !w.term) errors.push(`${at}: term mancante`)
  if (typeof w.meaning !== 'string' || (w.meaning as string).length < 10)
    errors.push(`${at}: meaning troppo corto`)
  if (!Array.isArray(w.examples) || w.examples.length < 1)
    errors.push(`${at}: servono almeno 1 esempio`)
  if (w.category !== undefined && !CATEGORIES.includes(w.category as string))
    errors.push(`${at}: category "${String(w.category)}" non valida`)
  if (w.difficulty !== undefined && ![1, 2, 3].includes(w.difficulty as number))
    errors.push(`${at}: difficulty deve essere 1, 2 o 3`)
})

if (errors.length) {
  console.error(`❌ ${errors.length} problemi:\n` + errors.map((e) => '  - ' + e).join('\n'))
  process.exit(1)
}
console.log(`✅ ${words.length} parole valide.`)
