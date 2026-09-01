import { useRef, useState } from 'react'
import { useProgress } from '@/state/context'
import { exportState, parseImported } from '@/core/storage/store'
import type { ThemeSetting } from '@/core/types'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { cn } from '@/ui/cn'

const THEMES: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Chiaro' },
  { value: 'dark', label: 'Scuro' },
]

export function SettingsPage() {
  const { state, updateSettings, replaceState, resetAll } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(null), 3000)
  }

  function onExport() {
    const blob = new Blob([exportState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vocabe-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File) {
    try {
      replaceState(parseImported(await file.text()))
      flash('Progressi importati')
    } catch {
      flash('File non valido')
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Tema</h2>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => updateSettings({ theme: t.value })}
              className={cn(
                'flex-1 rounded-2xl border py-2.5 text-sm font-medium transition',
                state.settings.theme === t.value
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line text-ink-soft',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Promemoria giornaliero</h2>
        <Card className="space-y-3 p-4">
          <label className="flex items-center justify-between">
            <span className="text-sm">Attiva promemoria</span>
            <input
              type="checkbox"
              checked={state.settings.reminderEnabled}
              onChange={(e) => updateSettings({ reminderEnabled: e.target.checked })}
              className="h-5 w-9 appearance-none rounded-full bg-line transition checked:bg-brand relative before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Orario</span>
            <input
              type="time"
              value={state.settings.reminderTime}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="rounded-xl border border-line bg-paper-raised px-3 py-1.5 text-sm"
            />
          </label>
          <p className="text-xs text-ink-soft">
            Le notifiche puntuali arrivano nell’app per Android. Sul web il promemoria è
            un semplice avviso quando riapri la scheda.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Dati</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={onExport}>
            Esporta progressi (backup)
          </Button>
          <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
            Importa da file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
          <Button
            variant="ghost"
            className="w-full text-bad"
            onClick={() => {
              if (confirm('Cancellare tutti i progressi? Non si può annullare.')) {
                resetAll()
                flash('Tutto azzerato')
              }
            }}
          >
            Azzera tutto
          </Button>
        </div>
        {msg && <p className="mt-2 text-center text-sm text-ink-soft">{msg}</p>}
      </section>

      <p className="pt-4 text-center text-xs text-ink-soft">
        Vocabe · i tuoi dati restano su questo dispositivo
      </p>
    </div>
  )
}
