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
            try {
                const res = await fetch("/words.json");
                if (!res.ok) throw new Error("words.json not found");
                const data: Word[] = await res.json();

                console.log(data);
                const today = new Date().toISOString().slice(0, 10);
                console.log(today);

                const todayWord = [...data]
                    .filter((w) => w.date <= today)
                    .sort((a, b) => b.date.localeCompare(a.date))[0];

                if (todayWord) {
                    setWord(todayWord);
                    setDone(localStorage.getItem(`done-${todayWord.date}`) === "true");
                } else {
                    setWord(null);
                }
            } catch (err) {
                console.error(err);
                setWord(null);
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

    if (!word) return <p>Non ci sono parole disponibili.</p>;

    return (
        <div className="bg-white shadow rounded-2xl p-6 space-y-4 max-w-xl mx-auto mt-10">
            <h1 className="text-2xl font-bold text-gray-900">{word.word}</h1>
            <p className="text-gray-700">{word.definition}</p>
            <ul className="list-disc list-inside text-gray-600">
                {word.examples.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                ))}
            </ul>
            <button
                onClick={toggleDone}
                className={`px-4 py-2 rounded-xl text-white transition ${done ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {done ? "Fatta ✅" : "Segna come fatta"}
            </button>
        </div>
    );
}
