import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { ScreenshotAnalyser } from '@/components/analyse/ScreenshotAnalyser'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Match Analyser — KickoffTo',
  description: 'Upload a screenshot of your TV. El Maestro analyses the tactical formation.',
}

export default function AnalysePage() {
  return (
    <>
      <Navbar />
      <Ticker segments={[
        '📸 Match Screenshot Analyser · powered by Gemini Vision',
        'Upload your TV screenshot — El Maestro reads the formation',
        'Free · No account needed · WC2026',
      ]} />
      <main style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px 100px' }}>

        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'var(--green)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
          }}>
            Powered by Gemini Vision
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 36px)',
            letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
          }}>
            MATCH ANALYSER
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Screenshot your TV or phone screen during a match.
            El Maestro reads the tactical formation and tells you
            what&apos;s really happening on the pitch.
          </p>
        </div>

        <ScreenshotAnalyser />

      </main>
      <BottomNav />
    </>
  )
}
