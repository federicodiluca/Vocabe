import { useEffect, useState } from 'react'
import { iap, initIap } from '@/core/iap'
import { useIsPro } from '@/core/iap/useIsPro'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { Sheet } from '@/ui/Sheet'

const BENEFITS = [
  'Nessuna pubblicità, mai',
  'Parola bonus ogni giorno, senza guardare video',
  'Tutte le categorie di parole sbloccate',
]

export function PaywallSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isPro = useIsPro()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const price = iap().proPriceLabel()

  useEffect(() => {
    if (open) initIap().then(() => setReady(true))
  }, [open])

  async function onBuy() {
    setBusy(true)
    await initIap()
    const r = await iap().purchasePro()
    setBusy(false)
    if (r === 'purchased') setNote('Grazie! Vocabe Pro è attivo.')
    else if (r === 'failed') setNote('Acquisto non disponibile ora. Riprova più tardi.')
  }

  async function onRestore() {
    setBusy(true)
    await initIap()
    const r = await iap().restore()
    setBusy(false)
    setNote(r === 'restored' ? 'Acquisto ripristinato.' : 'Nessun acquisto da ripristinare su questo account.')
  }

  if (isPro) {
    return (
      <Sheet open={open} onClose={onClose} title="Vocabe Pro">
        <p className="text-center text-sm text-ink-soft">
          Pro è già attivo su questo account. Grazie per il supporto.
        </p>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onClose={onClose} title="Vocabe Pro">
      <ul className="mb-5 space-y-3 text-sm">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <Button className="w-full" disabled={busy} onClick={onBuy}>
        Sblocca Pro{price ? ` — ${price}` : ''}
      </Button>
      <Button variant="ghost" className="mt-2 w-full" disabled={busy} onClick={onRestore}>
        Ripristina acquisto
      </Button>

      {note && <p className="mt-3 text-center text-sm text-ink-soft">{note}</p>}
      {!price && (
        <p className="mt-3 text-center text-xs text-ink-soft">
          {ready ? 'Il negozio non è disponibile al momento. Riprova più tardi.' : 'Apertura del negozio…'}
        </p>
      )}
    </Sheet>
  )
}
