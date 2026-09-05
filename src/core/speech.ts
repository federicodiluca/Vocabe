/** Italian text-to-speech via the browser's built-in speech synthesis. */
export const speechAvailable = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string): void {
  if (!speechAvailable()) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'it-IT'
  u.rate = 0.95
  const italian = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith('it'))
  if (italian) u.voice = italian
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
