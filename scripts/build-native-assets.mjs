/*
 * Builds the source images that @capacitor/assets turns into every Android/iOS
 * icon and splash size. Run `npm run assets:build` (regenerates assets/*.png),
 * then `npx @capacitor/assets generate`.
 */
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(resolve(root, 'scripts/icon-source.svg')) // full icon, dark background
const glyph = readFileSync(resolve(root, 'scripts/icon-glyph.svg')) // the "V" only, transparent
mkdirSync(resolve(root, 'assets'), { recursive: true })
const out = (name) => resolve(root, 'assets', name)

const INK = '#1c1917'

// App icon, edge to edge.
await sharp(src).resize(1024, 1024).png().toFile(out('icon-only.png'))

// Android adaptive: transparent foreground (glyph only) kept inside the safe area + solid background.
const inner = Math.round(1024 * 0.62)
const pad = Math.round((1024 - inner) / 2)
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } })
  .composite([{ input: await sharp(glyph).resize(inner, inner).png().toBuffer(), top: pad, left: pad }])
  .png()
  .toFile(out('icon-foreground.png'))

await sharp({ create: { width: 1024, height: 1024, channels: 4, background: INK } })
  .png()
  .toFile(out('icon-background.png'))

// Splash: logo centered on the dark background, same for light and dark.
const logo = Math.round(2732 * 0.22)
const splashPad = Math.round((2732 - logo) / 2)
const splash = await sharp({ create: { width: 2732, height: 2732, channels: 4, background: INK } })
  .composite([{ input: await sharp(glyph).resize(logo, logo).png().toBuffer(), top: splashPad, left: splashPad }])
  .png()
  .toBuffer()
await sharp(splash).toFile(out('splash.png'))
await sharp(splash).toFile(out('splash-dark.png'))

console.log('assets/: icon-only, icon-foreground, icon-background, splash, splash-dark')
