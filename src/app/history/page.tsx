import type { Metadata } from 'next'
import { HistoryClient } from './HistoryClient'

export const metadata: Metadata = {
  title: 'WC History — KickoffTo',
  description: 'Every World Cup from 1930 to 2026. Narrated by The Archive.',
}

export default function HistoryPage() {
  return <HistoryClient />
}
