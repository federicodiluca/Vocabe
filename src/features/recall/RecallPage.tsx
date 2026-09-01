import { useMemo, useState } from 'react'
import { WORDS, getWord } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { isDue } from '@/core/srs/leitner'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { cn } from '@/ui/cn'
import type { Word } from '@/core/types'

type Question = { word: Word; options: string[]; answer: number }

function pick<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

function buildQuiz(dueIds: string[]): Question[] {
  return pick(dueIds, Math.min(dueIds.length, 8)).flatMap((id) => {
    const word = getWord(id)
    if (!word) return []
    const distractors = pick(
      WORDS.filter((w) => w.id !== id).map((w) => w.meaning),
      3,
    )
    const options = pick([word.meaning, ...distractors], 4)
    return [{ word, options, answer: options.indexOf(word.meaning) }]
  })
}

export function RecallPage() {
  const { state, recordRecall } = useProgress()
  const dueIds = useMemo(
    () => Object.entries(state.learned).filter(([, e]) => isDue(e)).map(([id]) => id),
    [state.learned],
  )
  // Build once per mount so answering (which changes state) doesn't reshuffle mid-quiz.
  const [quiz] = useState(() => buildQuiz(dueIds))
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  if (quiz.length === 0) {
    return (
      <Card className="mt-6 text-center">
        <p className="text-4xl">🧠</p>
        <p className="mt-3 font-semibold">Nessun ripasso in sospeso</p>
        <p className="mt-1 text-sm text-ink-soft">
          Torna quando le parole che hai imparato saranno pronte per essere ripassate.
        </p>
      </Card>
    )
  }

  if (i >= quiz.length) {
    return (
      <Card className="mt-6 text-center">
        <p className="text-4xl">🎉</p>
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
      <p className="text-sm text-ink-soft">
        Domanda {i + 1} di {quiz.length}
      </p>
      <Card>
        <p className="text-sm text-ink-soft">Cosa significa</p>
        <h2 className="font-serif text-3xl font-semibold">{q.word.term}</h2>
      </Card>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const state =
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
                'w-full rounded-2xl border px-4 py-3 text-left text-sm transition',
                state === 'idle' && 'border-line hover:bg-line/40',
                state === 'correct' && 'border-good bg-good/10 text-good',
                state === 'wrong' && 'border-bad bg-bad/10 text-bad',
                state === 'dim' && 'border-line opacity-50',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <Button className="w-full" onClick={next}>
          {i + 1 === quiz.length ? 'Vedi risultato' : 'Prossima'}
        </Button>
      )}
    </div>
  )
}
