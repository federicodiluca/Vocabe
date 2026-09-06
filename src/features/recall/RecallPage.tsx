import { useState } from 'react'
import { useProgressSlice } from '@/state/hooks'
import { recordRecall } from '@/state/store'
import { isDue } from '@/core/srs/leitner'
import { buildQuiz } from '@/core/quiz'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { cn } from '@/ui/cn'

export function RecallPage() {
  const learned = useProgressSlice((s) => s.learned)

  // The round is fixed when the page opens: answering updates `learned`, and
  // rebuilding from that would reshuffle the questions mid-quiz.
  const [quiz] = useState(() =>
    buildQuiz(
      Object.entries(learned)
        .filter(([, e]) => isDue(e))
        .map(([id, e]) => ({ id, box: e.box })),
    ),
  )
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  if (quiz.length === 0) {
    return (
      <Card className="mt-6 animate-rise text-center">
        <Icon name="bulb" size={40} className="mx-auto text-brand" strokeWidth={1.4} />
        <p className="mt-3 font-semibold">Nessun ripasso in sospeso</p>
        <p className="mt-1 text-sm text-ink-soft">
          Torna quando le parole che hai imparato saranno pronte per essere ripassate.
        </p>
      </Card>
    )
  }

  if (i >= quiz.length) {
    return (
      <Card className="mt-6 animate-rise text-center">
        <Icon name="trophy" size={40} className="mx-auto animate-pop text-brand" strokeWidth={1.4} />
        <p className="mt-3 font-semibold">
          Ripasso completato: {score}/{quiz.length}
        </p>
        <p className="mt-1 text-sm text-ink-soft">Le parole sbagliate torneranno prima.</p>
      </Card>
    )
  }

  const q = quiz[i]
  const answered = choice !== null

  function choose(idx: number) {
    if (answered) return
    setChoice(idx)
    const correct = idx === q.answer
    if (correct) setScore((s) => s + 1)
    recordRecall(q.word.id, correct)
  }

  function next() {
    setChoice(null)
    setI((n) => n + 1)
  }

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          Domanda {i + 1} di {quiz.length}
        </span>
        <span className="rounded-full bg-line/60 px-2.5 py-0.5 text-xs">
          {q.direction === 'inverse' ? 'Indovina la parola' : 'Riconosci il significato'}
        </span>
      </div>

      <Card>
        <p className="text-sm text-ink-soft">
          {q.direction === 'inverse' ? 'Quale parola significa…' : 'Cosa significa'}
        </p>
        {q.direction === 'inverse' ? (
          <h2 className="mt-1 font-reading text-xl leading-snug">{q.prompt}</h2>
        ) : (
          <h2 className="font-reading text-3xl font-semibold">{q.prompt}</h2>
        )}
      </Card>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const s =
            !answered ? 'idle'
            : idx === q.answer ? 'correct'
            : idx === choice ? 'wrong'
            : 'dim'
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              disabled={answered}
              className={cn(
                'w-full rounded-2xl border px-4 py-3 text-left transition',
                q.direction === 'inverse' ? 'font-reading text-base' : 'text-sm',
                s === 'idle' && 'border-line hover:bg-line/40',
                s === 'correct' && 'border-good bg-good/10 text-good',
                s === 'wrong' && 'border-bad bg-bad/10 text-bad',
                s === 'dim' && 'border-line opacity-50',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <Button className="w-full animate-rise" onClick={next}>
          {i + 1 === quiz.length ? 'Vedi risultato' : 'Prossima'}
        </Button>
      )}
    </div>
  )
}
