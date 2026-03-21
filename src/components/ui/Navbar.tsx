'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/characters', label: 'Characters' },
  { href: '/live', label: 'Live' },
  { href: '/games', label: 'Games' },
  { href: '/story', label: 'Story' },
  { href: '/history', label: 'History' },
]

interface NavbarProps {
  isLive?: boolean
}

export function Navbar({ isLive = false }: NavbarProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('kt-theme') as 'dark' | 'light' | null
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const t = saved ?? sys
    setTheme(t)
    document.documentElement.className = t
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.className = next
    localStorage.setItem('kt-theme', next)
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, height: 64,
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
        color: 'var(--green)', letterSpacing: -0.3, textDecoration: 'none',
        flexShrink: 0,
      }}>
        KickoffTo
      </Link>

      {/* Desktop nav links */}
      <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}
           className="hidden md:flex">
        {NAV_LINKS.map(link => (
          <Link key={link.href} href={link.href} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            color: pathname === link.href ? 'var(--green)' : 'var(--text-2)',
            textDecoration: 'none',
            background: pathname === link.href ? 'var(--bg-elevated)' : 'transparent',
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        {isLive && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--green)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
          }}>
            <span className="animate-live" style={{
              width: 5, height: 5, borderRadius: '50%', background: '#fff',
              display: 'inline-block',
            }} />
            Live
          </div>
        )}
        <button onClick={toggleTheme} style={{
          width: 36, height: 36, borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--bg-elevated)',
          color: 'var(--text-2)', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  )
}
