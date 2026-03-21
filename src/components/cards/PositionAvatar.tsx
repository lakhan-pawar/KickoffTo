interface PositionAvatarProps {
  position: 'GK' | 'DEF' | 'MID' | 'ATT'
  kitColor: string
  accentColor?: string
  width?: number
  height?: number
}

export function PositionAvatar({
  position,
  kitColor,
  accentColor = '#ffffff',
  width = 120,
  height = 160,
}: PositionAvatarProps) {
  const viewBox = `0 0 120 160`

  const GKAvatar = () => (
    <g>
      {/* Body */}
      <rect x="40" y="60" width="40" height="55" rx="8" fill={kitColor} />
      {/* Shorts */}
      <rect x="40" y="100" width="18" height="20" rx="3" fill={accentColor} opacity="0.9" />
      <rect x="62" y="100" width="18" height="20" rx="3" fill={accentColor} opacity="0.9" />
      {/* Head */}
      <circle cx="60" cy="40" r="18" fill="#f5c5a3" />
      {/* Hair */}
      <path d="M42 36 Q60 20 78 36 Q78 28 60 22 Q42 28 42 36Z" fill="#2a1a0a" />
      {/* GK Gloves */}
      <rect x="20" y="70" width="20" height="14" rx="5" fill="#16a34a" />
      <rect x="80" y="70" width="20" height="14" rx="5" fill="#16a34a" />
      {/* Arms */}
      <line x1="40" y1="78" x2="22" y2="77" stroke={kitColor} strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="78" x2="98" y2="77" stroke={kitColor} strokeWidth="8" strokeLinecap="round" />
      {/* Legs */}
      <rect x="42" y="118" width="12" height="25" rx="4" fill="#1a1a3a" />
      <rect x="66" y="118" width="12" height="25" rx="4" fill="#1a1a3a" />
      {/* Boots */}
      <ellipse cx="48" cy="144" rx="10" ry="6" fill="#111" />
      <ellipse cx="72" cy="144" rx="10" ry="6" fill="#111" />
      {/* Number 1 */}
      <text x="60" y="90" textAnchor="middle" fontSize="16" fontWeight="bold"
        fill={accentColor} fontFamily="system-ui">1</text>
    </g>
  )

  const DEFAvatar = () => (
    <g>
      {/* Body - solid, wide stance */}
      <rect x="38" y="60" width="44" height="55" rx="8" fill={kitColor} />
      {/* Shorts */}
      <rect x="38" y="100" width="20" height="20" rx="3" fill={accentColor} opacity="0.9" />
      <rect x="62" y="100" width="20" height="20" rx="3" fill={accentColor} opacity="0.9" />
      {/* Head */}
      <circle cx="60" cy="40" r="18" fill="#c68642" />
      {/* Hair */}
      <path d="M42 35 Q60 20 78 35 Q76 24 60 20 Q44 24 42 35Z" fill="#1a0a00" />
      {/* Arms slightly out — defensive posture */}
      <line x1="38" y1="75" x2="18" y2="85" stroke={kitColor} strokeWidth="9" strokeLinecap="round" />
      <line x1="82" y1="75" x2="102" y2="85" stroke={kitColor} strokeWidth="9" strokeLinecap="round" />
      {/* Legs - wide stance */}
      <rect x="38" y="118" width="13" height="26" rx="4" fill="#1a1a3a" transform="rotate(-5 44 118)" />
      <rect x="69" y="118" width="13" height="26" rx="4" fill="#1a1a3a" transform="rotate(5 75 118)" />
      {/* Boots */}
      <ellipse cx="44" cy="145" rx="11" ry="6" fill="#111" />
      <ellipse cx="76" cy="145" rx="11" ry="6" fill="#111" />
    </g>
  )

  const MIDAvatar = () => (
    <g transform="translate(10, 0)">
      {/* Body - side profile running */}
      <rect x="35" y="60" width="38" height="52" rx="8" fill={kitColor}
        transform="rotate(-8 54 86)" />
      {/* Shorts */}
      <rect x="35" y="98" width="17" height="18" rx="3" fill={accentColor} opacity="0.9"
        transform="rotate(-8 44 107)" />
      <rect x="55" y="100" width="17" height="18" rx="3" fill={accentColor} opacity="0.9"
        transform="rotate(-3 64 109)" />
      {/* Head - angled */}
      <circle cx="56" cy="38" r="18" fill="#8d5524" />
      {/* Hair */}
      <path d="M38 34 Q56 18 74 34 Q72 22 56 18 Q40 22 38 34Z" fill="#0a0500" />
      {/* Running arm */}
      <line x1="35" y1="72" x2="18" y2="58" stroke={kitColor} strokeWidth="8"
        strokeLinecap="round" />
      <line x1="73" y1="68" x2="90" y2="82" stroke={kitColor} strokeWidth="8"
        strokeLinecap="round" />
      {/* Legs - running stride */}
      <rect x="34" y="115" width="13" height="28" rx="4" fill="#1a1a3a"
        transform="rotate(15 40 129)" />
      <rect x="58" y="113" width="13" height="28" rx="4" fill="#1a1a3a"
        transform="rotate(-20 65 127)" />
      {/* Boots */}
      <ellipse cx="48" cy="146" rx="12" ry="5" fill="#111"
        transform="rotate(15 48 146)" />
      <ellipse cx="62" cy="141" rx="10" ry="5" fill="#111"
        transform="rotate(-20 62 141)" />
    </g>
  )

  const ATTAvatar = () => (
    <g>
      {/* Body - shooting pose, leaning forward */}
      <rect x="38" y="55" width="40" height="55" rx="8" fill={kitColor}
        transform="rotate(-12 58 82)" />
      {/* Shorts */}
      <rect x="40" y="95" width="17" height="18" rx="3" fill={accentColor} opacity="0.9"
        transform="rotate(-12 48 104)" />
      <rect x="60" y="98" width="17" height="16" rx="3" fill={accentColor} opacity="0.9"
        transform="rotate(-8 68 106)" />
      {/* Head */}
      <circle cx="56" cy="36" r="18" fill="#f5c5a3" />
      {/* Hair */}
      <path d="M38 32 Q56 16 74 32 Q72 20 56 16 Q40 20 38 32Z" fill="#4a2800" />
      {/* Shooting arm back */}
      <line x1="38" y1="68" x2="16" y2="60" stroke={kitColor} strokeWidth="8"
        strokeLinecap="round" />
      {/* Shooting arm forward */}
      <line x1="78" y1="65" x2="98" y2="50" stroke={kitColor} strokeWidth="8"
        strokeLinecap="round" />
      {/* Planted leg */}
      <rect x="36" y="108" width="14" height="30" rx="4" fill="#1a1a3a"
        transform="rotate(-8 43 123)" />
      {/* Shooting leg raised */}
      <rect x="62" y="100" width="14" height="28" rx="4" fill="#1a1a3a"
        transform="rotate(35 69 114)" />
      {/* Boots */}
      <ellipse cx="42" cy="140" rx="12" ry="5" fill="#111" />
      <ellipse cx="80" cy="122" rx="10" ry="6" fill="#111"
        transform="rotate(35 80 122)" />
    </g>
  )

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient background */}
      <defs>
        <linearGradient id="avatarBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={kitColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={kitColor} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="120" height="160" fill="url(#avatarBg)" rx="4" />

      {position === 'GK' && <GKAvatar />}
      {position === 'DEF' && <DEFAvatar />}
      {position === 'MID' && <MIDAvatar />}
      {position === 'ATT' && <ATTAvatar />}
    </svg>
  )
}
