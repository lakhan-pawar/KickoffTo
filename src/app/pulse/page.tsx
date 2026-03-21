import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { PulseWidget } from '@/components/pulse/PulseWidget'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Internet Pulse — KickoffTo',
  description: 'What the world is saying about WC2026 right now.',
}

export default function PulsePage() {
  return (
    <>
      <Navbar />
      <Ticker segments={[
        '🌐 Internet Pulse · WC2026 · Live social feed',
        'Bluesky · Reddit · News · updated every 5 minutes',
      ]} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 100px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 40px)',
            letterSpacing: -0.5, color: 'var(--text)', marginBottom: 8,
          }}>
            INTERNET PULSE
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            What the world is saying about WC2026 right now.
          </p>
        </div>

        <PulseWidget />

      </main>
      <BottomNav />
    </>
  )
}
