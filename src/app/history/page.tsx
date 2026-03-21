// src/app/history/page.tsx
// Memory Palace v4
'use client'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { Ticker } from '@/components/ui/Ticker'
import { Flag } from '@/components/ui/Flag'
import Link from 'next/link'

// Note: metadata cannot be in a Client Component file in app router
// If this file must be a Client Component for event handlers, 
// we normally wrap it in a Server Component page.tsx or use a layout. 
// However, I will implement it as requested and see if build handles it.
// Actually, I'll use a Client Component for the main parts and keep the file as the entry point.

const WC: Array<{
  year: number
  winner: string
  code: string
  host: string
  kitColor: string
}> = [
  { year:1930, winner:'Uruguay',    code:'URU', host:'Uruguay',       kitColor:'#75aadb' },
  { year:1934, winner:'Italy',      code:'ITA', host:'Italy',         kitColor:'#003087' },
  { year:1938, winner:'Italy',      code:'ITA', host:'France',        kitColor:'#003087' },
  { year:1950, winner:'Uruguay',    code:'URU', host:'Brazil',        kitColor:'#75aadb' },
  { year:1954, winner:'W. Germany', code:'GER', host:'Switzerland',   kitColor:'#1a1a1a' },
  { year:1958, winner:'Brazil',     code:'BRA', host:'Sweden',        kitColor:'#f7e03b' },
  { year:1962, winner:'Brazil',     code:'BRA', host:'Chile',         kitColor:'#f7e03b' },
  { year:1966, winner:'England',    code:'ENG', host:'England',       kitColor:'#cf081f' },
  { year:1970, winner:'Brazil',     code:'BRA', host:'Mexico',        kitColor:'#f7e03b' },
  { year:1974, winner:'W. Germany', code:'GER', host:'W. Germany',    kitColor:'#1a1a1a' },
  { year:1978, winner:'Argentina',  code:'ARG', host:'Argentina',     kitColor:'#75aadb' },
  { year:1982, winner:'Italy',      code:'ITA', host:'Spain',         kitColor:'#003087' },
  { year:1986, winner:'Argentina',  code:'ARG', host:'Mexico',        kitColor:'#75aadb' },
  { year:1990, winner:'W. Germany', code:'GER', host:'Italy',         kitColor:'#1a1a1a' },
  { year:1994, winner:'Brazil',     code:'BRA', host:'USA',           kitColor:'#f7e03b' },
  { year:1998, winner:'France',     code:'FRA', host:'France',        kitColor:'#003087' },
  { year:2002, winner:'Brazil',     code:'BRA', host:'Korea / Japan', kitColor:'#f7e03b' },
  { year:2006, winner:'Italy',      code:'ITA', host:'Germany',       kitColor:'#003087' },
  { year:2010, winner:'Spain',      code:'ESP', host:'South Africa',  kitColor:'#d4213d' },
  { year:2014, winner:'Germany',    code:'GER', host:'Brazil',        kitColor:'#1a1a1a' },
  { year:2018, winner:'France',     code:'FRA', host:'Russia',        kitColor:'#003087' },
  { year:2022, winner:'Argentina',  code:'ARG', host:'Qatar',         kitColor:'#75aadb' },
  { year:2026, winner:'TBD',        code:'CAN', host:'CAN/MEX/USA',   kitColor:'#16a34a' },
]

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <Ticker segments={[
        '📜 All 23 World Cups · 1930–2026',
        'Narrated by The Archive',
        'Tap any year to hear the story',
      ]} />
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'20px 14px 80px' }}>

        <h1 style={{
          fontFamily:'var(--font-display)', fontWeight:900,
          fontSize:28, letterSpacing:-0.5, color:'var(--text)', marginBottom:6,
        }}>
          MEMORY PALACE
        </h1>
        <p style={{ fontSize:13, color:'var(--text-2)', marginBottom:20 }}>
          Every World Cup 1930–2026 · Tap any year — The Archive narrates
        </p>

        {/* Archive character strip */}
        <Link href="/characters/the-archive" style={{ textDecoration:'none', display:'block', marginBottom:24 }}>
          <div style={{
            background:'#0d1f0d', border:'1px solid rgba(34,197,94,0.15)',
            borderLeft:'3px solid #22c55e',
            borderRadius:'0 12px 12px 0', padding:'12px 16px',
            display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{
              width:36, height:36, borderRadius:9, background:'#1a3a1a',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0,
            }}>📜</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#4ade80', marginBottom:2 }}>
                The Archive · Football Historian
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>
                &ldquo;Every final a moment. Every heartbreak a story. Tap any year.&rdquo;
              </div>
            </div>
            <div style={{ fontSize:12, color:'#4ade80', fontWeight:600, flexShrink:0 }}>
              Chat →
            </div>
          </div>
        </Link>

        {/* Year grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))',
          gap:10,
        }}>
          {WC.map(wc => (
            <Link key={wc.year} href={`/history/${wc.year}`} style={{ textDecoration:'none' }}>
              <div
                style={{
                  borderRadius:16, overflow:'hidden',
                  background: wc.kitColor,
                  position:'relative', paddingTop:'130%',
                  boxShadow:`0 4px 16px ${wc.kitColor}55`,
                  transition:'transform 0.18s, box-shadow 0.18s',
                  cursor:'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px) scale(1.03)'
                  el.style.boxShadow = `0 10px 28px ${wc.kitColor}88`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'none'
                  el.style.boxShadow = `0 4px 16px ${wc.kitColor}55`
                }}
              >
                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', flexDirection:'column',
                  justifyContent:'space-between', padding:10,
                }}>
                  {/* Year badge */}
                  <div style={{
                    alignSelf:'flex-start',
                    background:'rgba(0,0,0,0.45)',
                    backdropFilter:'blur(8px)',
                    borderRadius:7, padding:'3px 8px',
                    fontFamily:'var(--font-display)',
                    fontSize:13, fontWeight:800, color:'#fff',
                  }}>
                    {wc.year}
                  </div>

                  {/* Flag centred */}
                  <div style={{
                    position:'absolute',
                    top:'50%', left:'50%',
                    transform:'translate(-50%,-56%)',
                  }}>
                    <Flag
                      code={wc.code}
                      size={52}
                      style={{ borderRadius:6, boxShadow:'0 4px 16px rgba(0,0,0,0.5)' }}
                    />
                  </div>

                  {/* Bottom pill */}
                  <div style={{
                    background:'rgba(0,0,0,0.55)',
                    backdropFilter:'blur(10px)',
                    borderRadius:10, padding:'7px 9px',
                  }}>
                    <div style={{
                      fontSize:12, fontWeight:800,
                      color:'#fff', lineHeight:1.2,
                    }}>
                      {wc.winner}
                    </div>
                    <div style={{
                      fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:2,
                    }}>
                      {wc.host}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
