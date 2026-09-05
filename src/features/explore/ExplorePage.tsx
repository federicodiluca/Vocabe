import { useMemo, useState } from 'react'
import { WORDS } from '@/core/content/words'
import { useProgress } from '@/state/context'
import type { WordCategory } from '@/core/types'
import { Icon } from '@/ui/Icon'
import { cn } from '@/ui/cn'
import { WordDetails } from '@/features/daily/WordDetails'

const CATEGORIES: { value: WordCategory | 'tutte'; label: string }[] = [
  { value: 'tutte', label: 'Tutte' },
  { value: 'comune', label: 'Comuni' },
  { value: 'letteraria', label: 'Letterarie' },
  { value: 'antica', label: 'Antiche' },
  { value: 'straniera', label: 'Straniere' },
  { value: 'regionale', label: 'Regionali' },
  { value: 'scientifica', label: 'Scientifiche' },
]

const DIFFICULTIES = [
  { value: 0, label: 'Ogni livello' },
  { value: 1, label: '●' },
  { value: 2, label: '●●' },
  { value: 3, label: '●●●' },
]

const SORTED = [...WORDS].sort((a, b) => a.term.localeCompare(b.term, 'it'))

export function ExplorePage() {
  const { isLearned } = useProgress()
  const [category, setCategory] = useState<WordCategory | 'tutte'>('tutte')
  const [difficulty, setDifficulty] = useState(0)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SORTED.filter((w) => {
      if (category !== 'tutte' && w.category !== category) return false
      if (difficulty && w.difficulty !== difficulty) return false
      if (q && !w.term.toLowerCase().includes(q) && !w.meaning.toLowerCase().includes(q)) return false
      return true
    })
  }, [category, difficulty, query])

  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm text-ink-soft">
        Tutte le {WORDS.length} parole di Vocabe. Filtra, cerca, ripassa.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cerca per parola o significato…"
        className="w-full rounded-2xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-brand"
      />

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition',
              category === c.value
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line text-ink-soft',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            className={cn(
              'flex-1 rounded-xl border py-1.5 text-xs font-medium transition',
              difficulty === d.value
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-line text-ink-soft',
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-soft">
        {results.length} {results.length === 1 ? 'parola' : 'parole'}
      </p>

      {results.length === 0 ? (
        <div className="animate-fade py-10 text-center">
          <Icon name="compass" size={36} className="mx-auto text-ink-soft" strokeWidth={1.3} />
          <p className="mt-3 text-sm text-ink-soft">Nessuna parola con questi filtri.</p>
          <button
            className="mt-2 text-sm text-brand underline"
            onClick={() => {
              setCategory('tutte')
              setDifficulty(0)
              setQuery('')
            }}
          >
            Azzera i filtri
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {results.map((word) => (
            <li key={word.id} className="rounded-2xl border border-line bg-paper-raised">
              <button
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                onClick={() => setOpen(open === word.id ? null : word.id)}
              >
                <span className="min-w-0">
                  <span className="font-serif text-lg font-semibold">{word.term}</span>
                  <span className="block truncate text-xs text-ink-soft">{word.meaning}</span>
                </span>
                {isLearned(word.id) && (
                  <Icon name="check" size={16} className="shrink-0 text-brand" />
                )}
              </button>
              {open === word.id && (
                <div className="border-t border-line px-4 py-4">
                  <WordDetails word={word} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
