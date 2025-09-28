import { useState, useEffect } from 'react'
import type { Word } from './types'
import WordCard from './components/WordCard'
import DoneButton from './components/DoneButton'

function getStorageKey() {
  const today = new Date().toISOString().slice(0, 10) // es: 2025-09-07
  return `vocabe:done:${today}`
}

export default function App() {
  const [word, setWord] = useState<Word | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/words.json')
      .then((res) => res.json())
      .then((data: Word[]) => {
        const today = new Date()
        const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
        const w = data[dayIndex % data.length]
        setWord(w)

        const key = getStorageKey()
        setDone(localStorage.getItem(key) === 'true')
      })
  }, [])

  const toggleDone = () => {
    const key = getStorageKey()
    const newValue = !done
    setDone(newValue)
    localStorage.setItem(key, String(newValue))
  }

  if (!word) {
    return <div style={{ padding: '2rem' }}>Caricamento...</div>
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vocabe 📚</h1>
      <WordCard word={word} />
      <DoneButton done={done} onToggle={toggleDone} />
    </div>
  )
}
