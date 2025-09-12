type Props = {
    done: boolean
    onToggle: () => void
}

export default function DoneButton({ done, onToggle }: Props) {
    return (
        <button onClick={onToggle}>
            {done ? '✅ Fatto' : 'Segna come fatto'}
        </button>
    )
}
