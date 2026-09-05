import { useEffect, useState } from 'react'
import type { Word } from '@/core/types'
import { useProgress } from '@/state/context'
import { renderShareCard } from '@/core/share/card'
import { shareText, shareImageFile, downloadBlob, copyText } from '@/core/share/share'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { Sheet } from '@/ui/Sheet'

export function ShareSheet({ word, open, onClose }: { word: Word; open: boolean; onClose: () => void }) {
  const { state } = useProgress()
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let revoked = false
    let objectUrl: string | null = null
    setBlob(null)
    setUrl(null)
    setError(false)
    setNote(null)
    renderShareCard(word, state)
      .then((b) => {
        if (revoked) return
        objectUrl = URL.createObjectURL(b)
        setBlob(b)
        setUrl(objectUrl)
      })
      .catch(() => !revoked && setError(true))
    return () => {
      revoked = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // state is intentionally read once at open time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, word])

  async function onShare() {
    if (!blob) return
    const text = shareText(word)
    const r = await shareImageFile(blob, text)
    if (r === 'unsupported' || r === 'failed') {
      downloadBlob(blob, `vocabe-${word.id}.png`)
      const copied = await copyText(text)
      setNote(copied ? 'Immagine scaricata e testo copiato' : 'Immagine scaricata')
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Condividi la parola">
      <div className="mb-4 overflow-hidden rounded-2xl border border-line bg-paper-raised">
        {url ? (
          <img src={url} alt={`Scheda della parola ${word.term}`} className="block w-full" />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center text-sm text-ink-soft">
            {error ? 'Impossibile creare l’immagine' : 'Creazione immagine…'}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button className="w-full" disabled={!blob} onClick={onShare}>
          <Icon name="share" size={18} /> Condividi
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={!blob}
          onClick={() => blob && downloadBlob(blob, `vocabe-${word.id}.png`)}
        >
          Scarica immagine
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={async () => setNote((await copyText(shareText(word))) ? 'Testo copiato' : 'Copia non riuscita')}
        >
          Copia solo testo
        </Button>
      </div>

      {note && <p className="mt-3 text-center text-sm text-ink-soft">{note}</p>}
      <p className="mt-1 text-center text-xs text-ink-soft">
        Su telefono “Condividi” apre il menu del sistema con immagine e testo.
      </p>
    </Sheet>
  )
}
