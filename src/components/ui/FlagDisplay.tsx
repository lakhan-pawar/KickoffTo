'use client'
import { useState, useEffect } from 'react'

interface FlagDisplayProps {
  countryCode: string  // ISO 3166-1 alpha-2 e.g. "AR", "FR", "CA"
  emoji: string        // fallback emoji e.g. "🇦🇷"
  size?: number        // px, default 28
  style?: React.CSSProperties
}

// Map our codes to ISO 2-letter codes
const CODE_MAP: Record<string, string> = {
  ARG: 'ar', BRA: 'br', FRA: 'fr', ENG: 'gb-eng', ESP: 'es',
  GER: 'de', POR: 'pt', NED: 'nl', CAN: 'ca', USA: 'us',
  MEX: 'mx', MAR: 'ma', JPN: 'jp', SEN: 'sn', CRO: 'hr',
  URU: 'uy', BEL: 'be', SUI: 'ch', DEN: 'dk', SWE: 'se',
  AUS: 'au', KOR: 'kr', IRN: 'ir', SAU: 'sa', ECU: 'ec',
  COL: 'co', CHI: 'cl', PER: 'pe', PAN: 'pa', NGA: 'ng',
  GHA: 'gh', CMR: 'cm', TUN: 'tn', ANG: 'ao', SRB: 'rs',
  POL: 'pl', CZE: 'cz', SVN: 'si', SVK: 'sk', TUR: 'tr',
  UKR: 'ua', GRE: 'gr', AUT: 'at', BIH: 'ba', RSA: 'za',
  IRQ: 'iq', ALB: 'al', TAN: 'tz', NZL: 'nz', VEN: 've',
  ITA: 'it', ELK: 'sv', MZB: 'mz',
}

export function FlagDisplay({ countryCode, emoji, size = 28, style }: FlagDisplayProps) {
  const [isWindows, setIsWindows] = useState(false)
  const iso = CODE_MAP[countryCode.toUpperCase()]

  useEffect(() => {
    // Detect Windows — flags don't render as images on Windows
    setIsWindows(navigator.platform?.toLowerCase().includes('win') ||
      navigator.userAgent?.toLowerCase().includes('windows'))
  }, [])

  if (!isWindows || !iso) {
    // Mobile / Mac: use emoji (renders natively, no network request)
    return (
      <span style={{ fontSize: size, lineHeight: 1, ...style }}>
        {emoji}
      </span>
    )
  }

  // Windows desktop: use flagcdn.com flag images
  return (
    <img
      src={`https://flagcdn.com/w${Math.min(size * 2, 80)}/${iso}.png`}
      alt={countryCode}
      width={size * 1.33}
      height={size}
      style={{
        objectFit: 'cover', borderRadius: 3,
        display: 'inline-block', verticalAlign: 'middle',
        ...style,
      }}
      onError={e => {
        // Fallback to emoji if image fails
        const el = e.currentTarget as HTMLImageElement
        el.style.display = 'none'
        el.insertAdjacentHTML('afterend', `<span style="font-size:${size}px">${emoji}</span>`)
      }}
    />
  )
}
