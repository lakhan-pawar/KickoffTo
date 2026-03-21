'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/',           icon: '🏠', label: 'Home'       },
  { href: '/characters', icon: '🎭', label: 'Characters' },
  { href: '/live',       icon: '⚡', label: 'Live'       },
  { href: '/games',      icon: '🎮', label: 'Games'      },
  { href: '/more',       icon: '⋯',  label: 'More'       },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      height: 'calc(60px + env(safe-area-inset-bottom))',
      display: 'flex',
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            textDecoration: 'none', minHeight: 44,
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: 500,
              color: isActive ? 'var(--green)' : 'var(--text-3)',
            }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
