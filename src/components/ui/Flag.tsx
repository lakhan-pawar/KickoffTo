'use client'

// ISO 3166-1 alpha-2 codes mapped from our team codes
export const FLAG_CODES: Record<string, string> = {
  // National teams
  ARG: 'ar', BRA: 'br', FRA: 'fr', ENG: 'gb-eng', ESP: 'es',
  GER: 'de', POR: 'pt', NED: 'nl', CAN: 'ca', USA: 'us',
  MEX: 'mx', MAR: 'ma', JPN: 'jp', SEN: 'sn', CRO: 'hr',
  URU: 'uy', BEL: 'be', SUI: 'ch', DEN: 'dk', SWE: 'se',
  AUS: 'au', KOR: 'kr', IRN: 'ir', SAU: 'sa', ECU: 'ec',
  COL: 'co', CHI: 'cl', PER: 'pe', PAN: 'pa', NGA: 'ng',
  CMR: 'cm', TUN: 'tn', ANG: 'ao', SRB: 'rs', SVN: 'si',
  SVK: 'sk', UKR: 'ua', GRE: 'gr', AUT: 'at', BIH: 'ba',
  RSA: 'za', IRQ: 'iq', ALB: 'al', TAN: 'tz', NZL: 'nz',
  VEN: 've', ITA: 'it', ELK: 'sv', MZB: 'mz', GHA: 'gh',
  // Also support lowercase
  arg: 'ar', bra: 'br', fra: 'fr', eng: 'gb-eng', esp: 'es',
  ger: 'de', por: 'pt', ned: 'nl', can: 'ca', usa: 'us',
  mex: 'mx', mar: 'ma', jpn: 'jp', sen: 'sn', cro: 'hr',
  uru: 'uy', bel: 'be', sui: 'ch', den: 'dk', kor: 'kr',
  aus: 'au', ecu: 'ec', col: 'co', chi: 'cl', per: 'pe',
  nga: 'ng', cmr: 'cm', tun: 'tn', srb: 'rs', ita: 'it',
  ven: 've', aut: 'at', gre: 'gr', irl: 'ie', sco: 'gb-sct',
  wal: 'gb-wls', rsa: 'za', irq: 'iq',
}

interface FlagProps {
  code: string       // team code e.g. "ARG" or "arg"
  emoji?: string     // fallback emoji
  size?: number      // px height, default 28
  className?: string
  style?: React.CSSProperties
}

export function Flag({ code, emoji, size = 28, className, style }: FlagProps) {
  const iso = FLAG_CODES[code] ?? FLAG_CODES[code?.toLowerCase()]

  if (!iso) {
    // Unknown code — show emoji or placeholder
    return (
      <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>
        {emoji ?? '🏳️'}
      </span>
    )
  }

  // Width = roughly 1.5x height for most flags
  const w = Math.round(size * 1.5)
  // Use flagcdn.com — reliable, fast CDN, no API key needed
  const src = `https://flagcdn.com/w${Math.min(w * 2, 160)}/${iso}.png`

  return (
    <img
      src={src}
      alt={code}
      width={w}
      height={size}
      loading="lazy"
      style={{
        objectFit: 'cover',
        borderRadius: 3,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      className={className}
      onError={e => {
        // Fallback to emoji on error
        const el = e.currentTarget
        el.style.display = 'none'
        const span = document.createElement('span')
        span.textContent = emoji ?? '🏳️'
        span.style.fontSize = `${size}px`
        el.parentNode?.insertBefore(span, el.nextSibling)
      }}
    />
  )
}
