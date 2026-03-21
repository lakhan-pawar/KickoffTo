'use client'
import { useState, useEffect } from 'react'

interface StreamingService {
  name: string
  description: string
  price: string
  url: string
  affiliate: boolean
  flag: string
}

const STREAMING_MAP: Record<string, StreamingService[]> = {
  US: [
    {
      name: 'Fubo',
      description: 'All 104 WC2026 matches live',
      price: 'From $80/mo',
      url: 'https://www.fubo.tv',
      affiliate: true,
      flag: '🇺🇸',
    },
    {
      name: 'Peacock',
      description: 'Selected WC2026 matches',
      price: 'From $7.99/mo',
      url: 'https://www.peacocktv.com',
      affiliate: true,
      flag: '🇺🇸',
    },
  ],
  CA: [
    {
      name: 'TSN+',
      description: 'All WC2026 matches — home of Canadian football',
      price: 'From $8/mo',
      url: 'https://www.tsn.ca/tsnplus',
      affiliate: true,
      flag: '🇨🇦',
    },
    {
      name: 'CTV',
      description: 'Selected WC2026 matches — free',
      price: 'Free',
      url: 'https://www.ctv.ca',
      affiliate: false,
      flag: '🇨🇦',
    },
  ],
  GB: [
    {
      name: 'BBC iPlayer',
      description: 'Live WC2026 coverage — free',
      price: 'Free',
      url: 'https://www.bbc.co.uk/iplayer',
      affiliate: false,
      flag: '🇬🇧',
    },
    {
      name: 'ITV X',
      description: 'Live WC2026 coverage — free',
      price: 'Free',
      url: 'https://www.itv.com/watch',
      affiliate: false,
      flag: '🇬🇧',
    },
  ],
  AU: [
    {
      name: 'Optus Sport',
      description: 'Live WC2026 coverage',
      price: 'From $6.99/mo',
      url: 'https://sport.optus.com.au',
      affiliate: true,
      flag: '🇦🇺',
    },
  ],
  DEFAULT: [
    {
      name: 'FIFA+',
      description: 'Official WC2026 streaming',
      price: 'Check local availability',
      url: 'https://www.fifa.com/fifaplus',
      affiliate: false,
      flag: '🌍',
    },
  ],
}

interface WatchLiveSheetProps {
  isOpen: boolean
  onClose: () => void
  matchTitle?: string
}

export function WatchLiveSheet({
  isOpen, onClose, matchTitle = 'this match'
}: WatchLiveSheetProps) {
  const [country, setCountry] = useState<string>('DEFAULT')
  const [services, setServices] = useState<StreamingService[]>([])

  useEffect(() => {
    // Detect country via a free IP API (no key needed)
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const code = data.country_code ?? 'DEFAULT'
        setCountry(code)
        setServices(STREAMING_MAP[code] ?? STREAMING_MAP.DEFAULT)
      })
      .catch(() => {
        setServices(STREAMING_MAP.DEFAULT)
      })
  }, [])

  if (!isOpen) return null

  function handleServiceClick(service: StreamingService) {
    window.open(service.url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, margin: '0 auto',
          background: 'var(--bg-card)',
          borderRadius: '16px 16px 0 0',
          border: '1px solid var(--border)',
          padding: '20px 20px 32px',
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'var(--border)', margin: '0 auto 16px',
        }} />

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 18, color: 'var(--text)', marginBottom: 4,
        }}>
          Watch live
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
          {matchTitle} · Services available in your region
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.map(service => (
            <button
              key={service.name}
              onClick={() => handleServiceClick(service)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--green)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{service.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: 'var(--text)', marginBottom: 2,
                }}>
                  {service.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {service.description}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: service.price === 'Free' ? 'var(--green)' : 'var(--text-2)',
                  marginBottom: 2,
                }}>
                  {service.price}
                </div>
                <div style={{ fontSize: 10, color: 'var(--green)' }}>
                  Watch now →
                </div>
              </div>
            </button>
          ))}
        </div>

        <p style={{
          fontSize: 10, color: 'var(--text-3)', textAlign: 'center',
          marginTop: 16, lineHeight: 1.5,
        }}>
          KickoffTo does not stream video — we redirect to licensed broadcasters.
          {services.some(s => s.affiliate) && (
            <> KickoffTo may earn a commission from affiliate links.</>
          )}
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 12, padding: '10px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text-2)', fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
