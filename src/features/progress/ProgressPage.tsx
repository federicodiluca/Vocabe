import { useMemo, useState } from 'react'
import { getWord } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { displayStreak } from '@/core/streak/streak'
import { BADGES } from '@/core/badges/badges'
import { cn } from '@/ui/cn'
import { WordDetails } from '@/features/daily/WordDetails'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-paper-raised p-4 text-center">
      <div className="font-serif text-2xl font-semibold">{value}</div>
      <div className="text-xs text-ink-soft">{label}</div>
    </div>
  )
}

export function ProgressPage() {
  const { state } = useProgress()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const entries = useMemo(() => {
    return Object.entries(state.learned)
      .map(([id, e]) => ({ id, entry: e, word: getWord(id) }))
      .filter((x) => x.word)
      .sort((a, b) => b.entry.learnedOn.localeCompare(a.entry.learnedOn))
  }, [state.learned])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (x) => x.word!.term.toLowerCase().includes(q) || x.word!.meaning.toLowerCase().includes(q),
    )
  }, [entries, query])

  const earned = new Set(state.badges)

  return (
    <div className="space-y-6 pt-2">
      <div className="flex gap-3">
        <Stat value={entries.length} label="parole imparate" />
        <Stat value={displayStreak(state.streak)} label="streak 🔥" />
        <Stat value={state.streak.longest} label="record" />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-soft">Obiettivi</h2>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((b) => {
            const has = earned.has(b.id)
            return (
              <div
                key={b.id}
                className={cn(
                  'rounded-2xl border p-3 text-sm',
                  has ? 'border-brand bg-brand-soft' : 'border-line opacity-60',
                )}
              >
                <div className="font-semibold">
                  {has ? '🏅' : '🔒'} {b.name}
                </div>
                <div className="text-xs text-ink-soft">{b.hint}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-soft">Storico</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca una parola…"
          className="mb-3 w-full rounded-2xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-brand"
        />

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-soft">
            {entries.length === 0 ? 'Nessuna parola ancora. Inizia da “Oggi”.' : 'Nessun risultato.'}
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map(({ id, entry, word }) => (
              <li key={id} className="rounded-2xl border border-line bg-paper-raised">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                  onClick={() => setOpen(open === id ? null : id)}
                >
                  <span>
                    <span className="font-serif text-lg font-semibold">{word!.term}</span>
                    <span className="ml-2 text-xs text-ink-soft">{entry.learnedOn}</span>
                  </span>
                  <span className="text-xs text-ink-soft">{'●'.repeat(entry.box)}</span>
                </button>
                {open === id && (
                  <div className="border-t border-line px-4 py-4">
                    <WordDetails word={word!} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
