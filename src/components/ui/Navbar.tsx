'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV = [
  { href: '/live',       label: 'Live',       emoji: '🔴' },
  { href: '/games',      label: 'Games',      emoji: '🎮' },
  { href: '/characters', label: 'Characters', emoji: '🎭' },
  { href: '/schedule',   label: 'Schedule',   emoji: '📅' },
  { href: '/cards',      label: 'Cards',      emoji: '🃏' },
  { href: 'mailto:hello@kickoffto.com', label: 'Feedback', emoji: '✉️' },
]

export function Navbar({ isLive }: { isLive?: boolean } = {}) {
  const pathname = usePathname()
  const [dark, setDark] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('kt-theme')
    const isDark = stored !== 'light'
    setDark(isDark)
    document.documentElement.className = isDark ? 'dark' : 'light'
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.className = next ? 'dark' : 'light'
    localStorage.setItem('kt-theme', next ? 'dark' : 'light')
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'rgba(8,8,8,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        transition: 'all 0.2s',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 16px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left: Logo */}
          <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #16a34a 0%, #0d7a35 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(22,163,74,0.4)',
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 14, color: '#fff', letterSpacing: -0.5,
            }}>
              KT
            </div>
          </Link>

          {/* Center/Right: Desktop Nav */}
          <nav className="desktop-nav" style={{
            display: 'none', // Overridden by globals.css media query
            gap: 4, alignItems: 'center',
          }}>
            {NAV.filter(n => !n.href.startsWith('mailto')).map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname?.startsWith(href)
              return (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '8px 14px', borderRadius: 10,
                    fontSize: 14, fontWeight: active ? 700 : 500,
                    color: active ? '#fff' : 'var(--text-3)',
                    background: active ? 'rgba(22,163,74,0.15)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    {label}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle (Visible on both) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {dark ? '☀' : '🌙'}
            </button>

            {/* Hamburger Button (Mobile Only) */}
            <button
              className="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none', // Overridden by globals.css media query
                width: 38, height: 38, borderRadius: 11,
                background: menuOpen ? 'var(--green)' : 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: menuOpen ? '#fff' : 'var(--text)',
                cursor: 'pointer', fontSize: 20,
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: 1100,
              }}
            >
              <div style={{ 
                position: 'relative', width: 20, height: 14,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <span style={{ 
                  width: '100%', height: 2, background: 'currentColor', borderRadius: 2,
                  transition: '0.3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none'
                }} />
                <span style={{ 
                  width: '100%', height: 2, background: 'currentColor', borderRadius: 2,
                  transition: '0.2s', opacity: menuOpen ? 0 : 1
                }} />
                <span style={{ 
                  width: '100%', height: 2, background: 'currentColor', borderRadius: 2,
                  transition: '0.3s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none'
                }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(5,5,5,0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          animation: 'menuFadeIn 0.3s forwards',
          display: 'flex', flexDirection: 'column',
          padding: '80px 24px 40px',
        }}>
          <div style={{
            maxWidth: 600, margin: '0 auto', width: '100%',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {NAV.map(({ href, label, emoji }, i) => (
              <Link 
                key={href} 
                href={href} 
                onClick={() => setMenuOpen(false)}
                style={{ 
                  textDecoration: 'none',
                  animation: `menuSlideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.05}s forwards`,
                  opacity: 0,
                }}
              >
                <div style={{
                  padding: '20px 24px', borderRadius: 20,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: 18, fontWeight: 800, color: 'var(--text)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      {label}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-3)', fontSize: 20 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ 
            marginTop: 'auto', textAlign: 'center', 
            color: 'var(--text-3)', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            kickoffto.com · your wc2026 home
          </div>
        </div>
      )}
    </>
  )
}
