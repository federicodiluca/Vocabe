import { useState, useEffect } from 'react'
import { words } from './words'

function getWordOfTheDay() {
  const today = new Date()
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  return words[dayIndex % words.length]
}

function getStorageKey() {
  const today = new Date().toISOString().slice(0, 10) // es: "2025-09-07"
  return `vocabe:done:${today}`
}

export default function App() {
  const word = getWordOfTheDay()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const key = getStorageKey()
    setDone(localStorage.getItem(key) === 'true')
  }, [])

  const toggleDone = () => {
    const key = getStorageKey()
    const newValue = !done
    setDone(newValue)
    localStorage.setItem(key, String(newValue))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vocabe 📚</h1>
      <h2>{word.term}</h2>
      <p><strong>Significato:</strong> {word.meaning}</p>
      <p><strong>Esempi:</strong></p>
      <ul>
        {word.examples.map((ex, i) => (
          <li key={i}>{ex}</li>
        ))}
      </ul>

      <button onClick={toggleDone}>
        {done ? '✅ Fatto' : 'Segna come fatto'}
      </button>
    </div>
  )
}
