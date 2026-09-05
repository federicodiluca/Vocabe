import { useMemo, useState } from 'react'
import { bonusWordForDay } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { useIsPro } from '@/core/iap/useIsPro'
import { MONETIZATION } from '@/core/features'
import { ads, initAds } from '@/core/ads'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { WordDetails } from './WordDetails'

export function BonusWordCard() {
  const { state, isLearned, markLearned, unmarkLearned } = useProgress()
  const isPro = useIsPro()
  const learnedIds = useMemo(() => new Set(Object.keys(state.learned)), [state.learned])
  const bonusWord = useMemo(() => bonusWordForDay(learnedIds), [learnedIds])

  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!bonusWord) return null
  const learned = isLearned(bonusWord.id)

  async function unlockWithAd() {
    setLoading(true)
    setMessage(null)
    await initAds()
    const result = await ads().showRewarded()
    setLoading(false)
    if (result === 'rewarded') setRevealed(true)
    else if (result === 'unavailable') setMessage('Disponibile solo nell’app Android.')
    else if (result === 'closed') setMessage('Guarda il video fino alla fine per sbloccarla.')
    else setMessage('Nessun video disponibile ora, riprova più tardi.')
  }

  return (
    <Card className="border-dashed">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
        <Icon name="sparkle" size={18} />
        Parola bonus
      </div>

      {revealed || isPro || !MONETIZATION ? (
        <>
          <h2 className="mb-4 font-serif text-2xl font-semibold">{bonusWord.term}</h2>
          <WordDetails word={bonusWord} />
          <div className="mt-4">
            {learned ? (
              <div className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3 text-brand">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Icon name="check" size={18} /> Imparata oggi
                </span>
                <button className="text-sm underline" onClick={() => unmarkLearned(bonusWord.id)}>
                  annulla
                </button>
              </div>
            ) : (
              <Button className="w-full" onClick={() => markLearned(bonusWord.id)}>
                <Icon name="check" size={18} /> Segna come imparata
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-soft">
            Guarda un breve video per sbloccare una seconda parola, oggi.
          </p>
          <Button variant="outline" className="w-full" disabled={loading} onClick={unlockWithAd}>
            {loading ? 'Caricamento…' : 'Guarda un video per sbloccarla'}
          </Button>
          {message && <p className="mt-2 text-center text-sm text-ink-soft">{message}</p>}
        </>
      )}
    </Card>
  )
}
