import type { Word } from '../types'

type Props = {
    word: Word
}

export default function WordCard({ word }: Props) {
    return (
        <div>
            <h2>{word.term}</h2>
            <p>
                <strong>Significato:</strong> {word.meaning}
            </p>
            <p>
                <strong>Esempi:</strong>
            </p>
            <ul>
                {word.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                ))}
            </ul>
        </div>
    )
}
