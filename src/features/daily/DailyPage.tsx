import { useMemo, useState } from 'react'
import { wordForDay } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { WordDetails } from './WordDetails'
import { ShareSheet } from './ShareSheet'
import { BonusWordCard } from './BonusWordCard'

const todayLabel = () =>
  new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

export function DailyPage() {
  const word = useMemo(() => wordForDay(), [])
  const { isLearned, markLearned, unmarkLearned } = useProgress()
  const [revealed, setRevealed] = useState(() => isLearned(word.id))
  const [justRevealed, setJustRevealed] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const learned = isLearned(word.id)

  return (
    <div className="space-y-6">
      <p className="text-sm capitalize text-ink-soft">{todayLabel()}</p>

      <Card
        className={revealed ? undefined : 'cursor-pointer'}
        onClick={
          revealed
            ? undefined
            : () => {
                setRevealed(true)
                setJustRevealed(true)
              }
        }
      >
        <div className="mb-4 flex items-baseline gap-2">
          <h1 className="font-serif text-4xl font-semibold tracking-tight">{word.term}</h1>
          {word.pos && <span className="text-sm italic text-ink-soft">{word.pos}</span>}
        </div>

        {revealed ? (
          <div className={justRevealed ? 'animate-rise' : undefined}>
            <WordDetails word={word} />
          </div>
        ) : (
          <p className="py-6 text-center text-ink-soft">Tocca per scoprire il significato</p>
        )}
      </Card>

      {revealed && (
        <div className="space-y-3">
          {learned ? (
            <div className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3 text-brand">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Icon name="check" size={18} /> Imparata oggi
              </span>
              <button className="text-sm underline" onClick={() => unmarkLearned(word.id)}>
                annulla
              </button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => markLearned(word.id)}>
              <Icon name="check" size={18} /> Segna come imparata
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={() => setShareOpen(true)}>
            <Icon name="share" size={18} /> Condividi
          </Button>
        </div>
      )}

      {learned && <BonusWordCard />}

      <ShareSheet word={word} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  )
}
