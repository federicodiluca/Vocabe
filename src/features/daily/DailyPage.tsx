import { useMemo, useState } from 'react'
import { wordForDay } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { shareWord } from '@/core/share/share'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { WordDetails } from './WordDetails'

const todayLabel = () =>
  new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

export function DailyPage() {
  const word = useMemo(() => wordForDay(), [])
  const { isLearned, markLearned, unmarkLearned, state } = useProgress()
  const [revealed, setRevealed] = useState(() => isLearned(word.id))
  const [shareMsg, setShareMsg] = useState<string | null>(null)

  const learned = isLearned(word.id)

  async function onShare() {
    const r = await shareWord(word, state)
    setShareMsg(r === 'copied' ? 'Copiato negli appunti' : r === 'failed' ? 'Condivisione non riuscita' : null)
    if (r !== 'shared') setTimeout(() => setShareMsg(null), 2500)
  }

  return (
    <div className="space-y-6">
      <p className="text-sm capitalize text-ink-soft">{todayLabel()}</p>

      <Card
        className={revealed ? undefined : 'cursor-pointer'}
        onClick={revealed ? undefined : () => setRevealed(true)}
      >
        <div className="mb-4 flex items-baseline gap-2">
          <h1 className="font-serif text-4xl font-semibold tracking-tight">{word.term}</h1>
          {word.pos && <span className="text-sm italic text-ink-soft">{word.pos}</span>}
        </div>

        {revealed ? (
          <WordDetails word={word} />
        ) : (
          <p className="py-6 text-center text-ink-soft">Tocca per scoprire il significato</p>
        )}
      </Card>

      {revealed && (
        <div className="space-y-3">
          {learned ? (
            <div className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3 text-brand">
              <span className="font-semibold">✅ Imparata oggi</span>
              <button className="text-sm underline" onClick={() => unmarkLearned(word.id)}>
                annulla
              </button>
            </div>
          ) : (
            <Button className="w-full" onClick={() => markLearned(word.id)}>
              Segna come imparata ✅
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={onShare}>
            Condividi 📤
          </Button>
          {shareMsg && <p className="text-center text-sm text-ink-soft">{shareMsg}</p>}
        </div>
      )}
    </div>
  )
}
