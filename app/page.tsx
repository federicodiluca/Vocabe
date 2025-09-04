"use client";

import { useEffect, useState } from "react";

interface Word {
    date: string;
    word: string;
    definition: string;
    examples: string[];
}

export default function Home() {
    const [word, setWord] = useState<Word | null>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        async function fetchWord() {
            const res = await fetch("/words.json");
            const data: Word[] = await res.json();

            const today = new Date().toISOString().slice(0, 10);
            const todayWord = data.find((w) => w.date === today);

            if (todayWord) {
                setWord(todayWord);
                setDone(localStorage.getItem(`done-${todayWord.date}`) === "true");
            }
        }

        fetchWord();
    }, []);

    function toggleDone() {
        if (!word) return;
        const newValue = !done;
        setDone(newValue);
        localStorage.setItem(`done-${word.date}`, String(newValue));
    }

    if (!word) return <p>Oggi non ci sono parole disponibili.</p>;

    return (
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
            <h1 className="text-2xl font-bold">{word.word}</h1>
            <p className="text-gray-700">{word.definition}</p>
            <ul className="list-disc list-inside text-gray-600">
                {word.examples.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                ))}
            </ul>
            <button
                onClick={toggleDone}
                className={`px-4 py-2 rounded-xl text-white ${done ? "bg-green-500" : "bg-blue-500"
                    }`}
            >
                {done ? "Fatta ✅" : "Segna come fatta"}
            </button>
        </div>
    );
}
