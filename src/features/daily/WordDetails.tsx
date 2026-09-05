import { useState } from 'react'
import type { Word } from '@/core/types'
import { useProgress } from '@/state/context'
import { speak, speechAvailable } from '@/core/speech'
import { Icon } from '@/ui/Icon'
import { cn } from '@/ui/cn'

const CATEGORY_LABEL: Record<NonNullable<Word['category']>, string> = {
  comune: 'comune',
  letteraria: 'letteraria',
  scientifica: 'scientifica',
  antica: 'antica',
  regionale: 'regionale',
  straniera: 'straniera',
}

export function WordDetails({ word }: { word: Word }) {
  const { state, isFavorite, toggleFavorite, setNote } = useProgress()
  const fav = isFavorite(word.id)
  const savedNote = state.notes[word.id] ?? ''
  const [noteOpen, setNoteOpen] = useState(Boolean(savedNote))
  const [draft, setDraft] = useState(savedNote)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 text-ink-soft">
        <button
          onClick={() => toggleFavorite(word.id)}
          aria-label={fav ? 'Togli dai preferiti' : 'Aggiungi ai preferiti'}
          className={cn('rounded-full p-1.5 transition hover:bg-line/50', fav && 'text-brand')}
        >
          <Icon name={fav ? 'star-filled' : 'star'} size={20} />
        </button>
        {speechAvailable() && (
          <button
            onClick={() => speak(word.term)}
            aria-label="Ascolta la pronuncia"
            className="rounded-full p-1.5 transition hover:bg-line/50"
          >
            <Icon name="speaker" size={20} />
          </button>
        )}
        <button
          onClick={() => setNoteOpen((v) => !v)}
          aria-label="Nota personale"
          className={cn('rounded-full p-1.5 transition hover:bg-line/50', savedNote && 'text-brand')}
        >
          <Icon name="note" size={20} />
        </button>
      </div>

      <p className="text-lg leading-relaxed">{word.meaning}</p>

      {word.examples.length > 0 && (
        <ul className="space-y-2 border-l-2 border-brand/40 pl-4">
          {word.examples.map((ex, i) => (
            <li key={i} className="font-serif italic text-ink-soft">
              {ex}
            </li>
          ))}
        </ul>
      )}

      {word.synonyms && word.synonyms.length > 0 && (
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">Sinonimi:</span> {word.synonyms.join(', ')}
        </p>
      )}

      {word.etymology && (
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">Etimologia:</span> {word.etymology}
        </p>
      )}

      {word.curiosity && (
        <p className="flex gap-2 rounded-2xl bg-brand-soft/60 p-4 text-sm leading-relaxed text-ink">
          <Icon name="sparkle" size={18} className="mt-0.5 shrink-0 text-brand" />
          <span>{word.curiosity}</span>
        </p>
      )}

      {noteOpen && (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => setNote(word.id, draft)}
          placeholder="Nota personale…"
          rows={2}
          className="w-full rounded-2xl border border-line bg-paper-raised p-3 text-sm outline-none focus:border-brand"
        />
      )}

      <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
        {word.category && (
          <span className="rounded-full border border-line px-2 py-0.5">
            {CATEGORY_LABEL[word.category]}
          </span>
        )}
        {word.difficulty && (
          <span className="rounded-full border border-line px-2 py-0.5">
            {'●'.repeat(word.difficulty)}
            {'○'.repeat(3 - word.difficulty)} difficoltà
          </span>
        )}
      </div>
    </div>
  )
}
