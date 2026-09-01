import type { Word } from '@/core/types'
import { Icon } from '@/ui/Icon'

const CATEGORY_LABEL: Record<NonNullable<Word['category']>, string> = {
  comune: 'comune',
  letteraria: 'letteraria',
  scientifica: 'scientifica',
  antica: 'antica',
  regionale: 'regionale',
  straniera: 'straniera',
}

export function WordDetails({ word }: { word: Word }) {
  return (
    <div className="space-y-5">
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
