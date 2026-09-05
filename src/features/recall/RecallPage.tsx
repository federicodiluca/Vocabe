import { useMemo, useState } from 'react'
import { WORDS, getWord } from '@/core/content/words'
import { useProgress } from '@/state/context'
import { isDue } from '@/core/srs/leitner'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { cn } from '@/ui/cn'
import type { Word } from '@/core/types'

type Direction = 'forward' | 'inverse'
type Question = {
  word: Word
  direction: Direction
  prompt: string
  options: string[]
  answer: number
}

function pick<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

function makeQuestion(word: Word, direction: Direction): Question {
  if (direction === 'inverse') {
    // Show the definition, pick the word.
    const distractors = pick(
      WORDS.filter((w) => w.id !== word.id).map((w) => w.term),
      3,
    )
    const options = pick([word.term, ...distractors], 4)
    return { word, direction, prompt: word.meaning, options, answer: options.indexOf(word.term) }
  }
  // Show the word, pick the definition.
  const distractors = pick(
    WORDS.filter((w) => w.id !== word.id).map((w) => w.meaning),
    3,
  )
  const options = pick([word.meaning, ...distractors], 4)
  return { word, direction, prompt: word.term, options, answer: options.indexOf(word.meaning) }
}

function buildQuiz(due: { id: string; box: number }[]): Question[] {
  return pick(due, Math.min(due.length, 8)).flatMap(({ id, box }) => {
    const word = getWord(id)
    if (!word) return []
    // Once a word is well known (box 3+) the harder "definition → word" direction kicks in.
    return [makeQuestion(word, box >= 3 ? 'inverse' : 'forward')]
  })
}

export function RecallPage() {
  const { state, recordRecall } = useProgress()
  const due = useMemo(
    () =>
      Object.entries(state.learned)
        .filter(([, e]) => isDue(e))
        .map(([id, e]) => ({ id, box: e.box })),
    [state.learned],
  )
  // Build once per mount so answering (which changes state) doesn't reshuffle mid-quiz.
  const [quiz] = useState(() => buildQuiz(due))
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
          <h2 className="mt-1 font-serif text-xl leading-snug">{q.prompt}</h2>
        ) : (
          <h2 className="font-serif text-3xl font-semibold">{q.prompt}</h2>
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
                q.direction === 'inverse' ? 'font-serif text-base' : 'text-sm',
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
