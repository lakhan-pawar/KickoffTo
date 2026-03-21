import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { groqChat } from '@/lib/groq'
import { getCache, setCache } from '@/lib/redis'
import Link from 'next/link'
import type { Metadata } from 'next'
import groupsData from '@/data/wc2026-groups.json'

interface PageProps {
  params: Promise<{ code: string }>
}

// Confederation colors repeated here for server-side use
const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA:     '#003087',
  CONMEBOL: '#009c3b',
  CONCACAF: '#e31837',
  CAF:      '#ffd700',
  AFC:      '#cc0001',
  OFC:      '#00a0e9',
}

// Full squad data for featured teams
const SQUADS: Record<string, {
  manager: string
  starPlayers: Array<{ name: string; position: string; club: string; caps?: number }>
  style: string
  strength: string
  weakness: string
}> = {
  'arg': {
    manager: 'Lionel Scaloni',
    starPlayers: [
      { name: 'Lionel Messi', position: 'ATT', club: 'Inter Miami', caps: 185 },
      { name: 'Enzo Fernández', position: 'MID', club: 'Chelsea', caps: 52 },
      { name: 'Lautaro Martínez', position: 'ATT', club: 'Inter Milan', caps: 68 },
      { name: 'Julián Álvarez', position: 'ATT', club: 'Atlético Madrid', caps: 42 },
      { name: 'Rodrigo De Paul', position: 'MID', club: 'Atlético Madrid', caps: 73 },
    ],
    style: 'Possession-based with rapid transitions. Messi as free roaming 10.',
    strength: 'Individual brilliance. Messi\'s tournament experience unmatched.',
    weakness: 'Defensive vulnerability on the counter when De Paul pushes forward.',
  },
  'bra': {
    manager: 'Dorival Júnior',
    starPlayers: [
      { name: 'Vinicius Jr.', position: 'LW', club: 'Real Madrid', caps: 44 },
      { name: 'Rodrygo', position: 'RW', club: 'Real Madrid', caps: 38 },
      { name: 'Raphinha', position: 'RW', club: 'FC Barcelona', caps: 51 },
      { name: 'Lucas Paquetá', position: 'MID', club: 'West Ham', caps: 63 },
      { name: 'Casemiro', position: 'CDM', club: 'Manchester United', caps: 84 },
    ],
    style: 'High press, wide attacks, Vinicius carrying the creative burden.',
    strength: 'Pace and flair on the wings. Devastating in transition.',
    weakness: 'Inconsistent defensive structure without Casemiro at his best.',
  },
  'fra': {
    manager: 'Didier Deschamps',
    starPlayers: [
      { name: 'Kylian Mbappé', position: 'ATT', club: 'Real Madrid', caps: 88 },
      { name: 'Antoine Griezmann', position: 'MID', club: 'Atlético Madrid', caps: 137 },
      { name: 'Aurélien Tchouaméni', position: 'CDM', club: 'Real Madrid', caps: 32 },
      { name: 'William Saliba', position: 'CB', club: 'Arsenal', caps: 28 },
      { name: 'Mike Maignan', position: 'GK', club: 'AC Milan', caps: 22 },
    ],
    style: 'Defensively solid, clinical on the counter. Mbappé as central striker.',
    strength: 'Defensive depth. Multiple world-class attackers.',
    weakness: 'Mbappé-dependency. Struggles to break down low blocks.',
  },
  'eng': {
    manager: 'Gareth Southgate',
    starPlayers: [
      { name: 'Jude Bellingham', position: 'MID', club: 'Real Madrid', caps: 48 },
      { name: 'Harry Kane', position: 'ST', club: 'Bayern Munich', caps: 98 },
      { name: 'Phil Foden', position: 'MID', club: 'Man City', caps: 45 },
      { name: 'Bukayo Saka', position: 'RW', club: 'Arsenal', caps: 52 },
      { name: 'Kyle Walker', position: 'RB', club: 'Man City', caps: 82 },
    ],
    style: 'Structured, adaptable. Bellingham free role from midfield.',
    strength: 'Balance of Premier League quality throughout the squad.',
    weakness: 'Tournament pressure. Tendency to become passive when defending.',
  },
  'esp': {
    manager: 'Luis de la Fuente',
    starPlayers: [
      { name: 'Lamine Yamal', position: 'RW', club: 'FC Barcelona', caps: 24 },
      { name: 'Pedri', position: 'MID', club: 'FC Barcelona', caps: 44 },
      { name: 'Rodri', position: 'CDM', club: 'Man City', caps: 62 },
      { name: 'Álvaro Morata', position: 'ST', club: 'AC Milan', caps: 78 },
      { name: 'Nico Williams', position: 'LW', club: 'Athletic Bilbao', caps: 22 },
    ],
    style: 'Tiki-taka evolved. High press, quick triangles, Yamal as destroyer.',
    strength: 'Midfield control. Yamal and Nico Williams on the wings.',
    weakness: 'Striker goals. Morata inconsistency at major tournaments.',
  },
  'ger': {
    manager: 'Julian Nagelsmann',
    starPlayers: [
      { name: 'Florian Wirtz', position: 'CAM', club: 'Bayer Leverkusen', caps: 32 },
      { name: 'Jamal Musiala', position: 'MID', club: 'Bayern Munich', caps: 44 },
      { name: 'Kai Havertz', position: 'ST', club: 'Arsenal', caps: 58 },
      { name: 'Antonio Rüdiger', position: 'CB', club: 'Real Madrid', caps: 72 },
      { name: 'Toni Kroos', position: 'MID', club: 'Real Madrid', caps: 108 },
    ],
    style: 'Gegenpressing with technical quality. Wirtz as creative hub.',
    strength: 'Pressing intensity. Young talented core peaking at right time.',
    weakness: 'Transition between eras. Can struggle against well-organised defences.',
  },
  'por': {
    manager: 'Roberto Martínez',
    starPlayers: [
      { name: 'Cristiano Ronaldo', position: 'ST', club: 'Al Nassr', caps: 214 },
      { name: 'Rafael Leão', position: 'LW', club: 'AC Milan', caps: 38 },
      { name: 'Bernardo Silva', position: 'MID', club: 'Man City', caps: 92 },
      { name: 'Bruno Fernandes', position: 'CAM', club: 'Man United', caps: 78 },
      { name: 'Rúben Dias', position: 'CB', club: 'Man City', caps: 64 },
    ],
    style: 'Physical with technical quality. Ronaldo leading line at 41.',
    strength: 'Experience. Leão and Félix provide devastating pace.',
    weakness: 'Ronaldo dependency. Potential succession issue if he struggles.',
  },
  'can': {
    manager: 'Jesse Marsch',
    starPlayers: [
      { name: 'Alphonso Davies', position: 'LB', club: 'Bayern Munich', caps: 58 },
      { name: 'Jonathan David', position: 'ST', club: 'LOSC Lille', caps: 44 },
      { name: 'Cyle Larin', position: 'ST', club: 'Club Brugge', caps: 62 },
      { name: 'Stephen Eustáquio', position: 'MID', club: 'FC Porto', caps: 38 },
      { name: 'Ismaël Koné', position: 'MID', club: 'Watford', caps: 24 },
    ],
    style: 'Direct and physical. Davies providing width and pace down the left.',
    strength: 'Home advantage. Davies-David combination devastating.',
    weakness: 'Inexperience at major tournaments. Pressure of hosting.',
  },
  'ned': {
    manager: 'Ronald Koeman',
    starPlayers: [
      { name: 'Virgil van Dijk', position: 'CB', club: 'Liverpool', caps: 72 },
      { name: 'Cody Gakpo', position: 'LW', club: 'Liverpool', caps: 44 },
      { name: 'Tijjani Reijnders', position: 'MID', club: 'AC Milan', caps: 28 },
      { name: 'Xavi Simons', position: 'MID', club: 'PSG', caps: 32 },
      { name: 'Memphis Depay', position: 'ST', club: 'Atlético Madrid', caps: 94 },
    ],
    style: 'Attacking 4-3-3. High line, aggressive press, quick build-up.',
    strength: 'Van Dijk anchors a solid defence. Simons creative spark.',
    weakness: 'Reliance on individuals. Can lose shape against compact opposition.',
  },
  'usa': {
    manager: 'Mauricio Pochettino',
    starPlayers: [
      { name: 'Christian Pulisic', position: 'ATT', club: 'AC Milan', caps: 78 },
      { name: 'Tyler Adams', position: 'CDM', club: 'AFC Bournemouth', caps: 52 },
      { name: 'Weston McKennie', position: 'MID', club: 'Juventus', caps: 62 },
      { name: 'Folarin Balogun', position: 'ST', club: 'Monaco', caps: 18 },
      { name: 'Matt Turner', position: 'GK', club: 'Crystal Palace', caps: 38 },
    ],
    style: 'Intense pressing, athletic and physically dominant.',
    strength: 'Home advantage. Pulisic at peak powers.',
    weakness: 'Goals — striker options lack elite finishing.',
  },
  'mex': {
    manager: 'Javier Aguirre',
    starPlayers: [
      { name: 'Hirving Lozano', position: 'RW', club: 'PSV', caps: 82 },
      { name: 'Alexis Vega', position: 'LW', club: 'Guadalajara', caps: 44 },
      { name: 'Edson Álvarez', position: 'CDM', club: 'West Ham', caps: 78 },
      { name: 'Raúl Jiménez', position: 'ST', club: 'Fulham', caps: 92 },
      { name: 'Guillermo Ochoa', position: 'GK', club: 'América', caps: 148 },
    ],
    style: 'Deep block, organised, counter-attack through Lozano.',
    strength: 'Home advantage at Azteca. Ochoa\'s experience irreplaceable.',
    weakness: 'Aging squad. Lack of world-class striker to lead the line.',
  },
}

function getTeamFromGroups(code: string) {
  const upperCode = code.toUpperCase()
  for (const group of groupsData.groups) {
    const team = group.teams.find(t => t.code === upperCode)
    if (team) return { ...team, group: group.letter }
  }
  return null
}

async function getTeamScoutReport(teamName: string, teamCode: string): Promise<string> {
  const cacheKey = `team-scout:${teamCode}`
  try {
    const cached = await getCache<{ report: string }>(cacheKey)
    if (cached) return cached.report
  } catch {}

  try {
    const report = await groqChat(
      [{
        role: 'user',
        content: `You are TalentSpotter at KickoffTo, scouting WC2026 teams.
Write a 3-sentence team scouting report for ${teamName} at WC2026.
Mention their tactical setup, key strength, and one concern.
Style: precise, professional, analytical. 3 sentences only.`,
      }],
      'llama-3.1-8b-instant',
      200,
    )
    await setCache(cacheKey, { report: report.trim() }, 86400 * 7)
    return report.trim()
  } catch {
    return `${teamName} arrive at WC2026 with clear intentions and a well-drilled squad. Their tactical organisation has been refined over multiple qualifying campaigns. The question is whether individual quality can match their collective commitment at this level.`
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  const team = getTeamFromGroups(code)
  if (!team) return { title: 'Team — KickoffTo' }
  return {
    title: `${team.name} — WC2026 · KickoffTo`,
    description: `${team.name} WC2026 squad, star players and AI scouting report. Group ${team.group}.`,
  }
}

export function generateStaticParams() {
  return groupsData.groups.flatMap(g =>
    g.teams.map(t => ({ code: t.code.toLowerCase() }))
  )
}

export default async function TeamPage({ params }: PageProps) {
  const { code } = await params
  const team = getTeamFromGroups(code)

  if (!team) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: 600, margin: '0 auto', padding: '60px 16px',
          textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>
            Team not found
          </h1>
          <Link href="/teams" style={{ color: 'var(--green)', fontSize: 13 }}>
            ← All teams
          </Link>
        </main>
        <BottomNav />
      </>
    )
  }

  const squad = SQUADS[code.toLowerCase()]
  const scoutReport = await getTeamScoutReport(team.name, code)

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 100px' }}>

        <Link href="/teams" style={{
          fontSize: 12, color: 'var(--green)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24,
        }}>
          ← All teams
        </Link>

        {/* Team header */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, marginBottom: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Ghost flag */}
          <div style={{
            position: 'absolute', right: -10, top: -10,
            fontSize: 120, opacity: 0.05, lineHeight: 1, pointerEvents: 'none',
          }}>
            {team.flag}
          </div>

          {/* Kit strip */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
            {team.kitColors.map((color, i) => (
              <div key={i} style={{
                height: 6, flex: 1, borderRadius: 3, background: color,
              }} />
            ))}
          </div>

          <div style={{ fontSize: 64, marginBottom: 8 }}>{team.flag}</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 32, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 6,
          }}>
            {team.name}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
              background: (CONFEDERATION_COLORS[team.confederation] ?? '#888') + '22',
              color: CONFEDERATION_COLORS[team.confederation] ?? '#888',
            }}>
              {team.confederation}
            </span>
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 6,
              background: 'var(--bg-elevated)', color: 'var(--text-3)',
              border: '1px solid var(--border)',
            }}>
              Group {team.group}
            </span>
          </div>

          {squad?.manager && (
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              <span style={{ color: 'var(--text-3)', marginRight: 6 }}>Manager</span>
              {squad.manager}
            </div>
          )}
        </div>

        {/* TalentSpotter scout report */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderLeft: '3px solid #1a3a3a',
          borderRadius: '0 12px 12px 0', padding: 16, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, background: '#1a3a3a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 9, color: 'rgba(255,255,255,0.85)',
            }}>TS</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
              TalentSpotter · Team Scout Report
            </span>
          </div>
          <p style={{
            fontSize: 13, color: 'var(--text-2)',
            lineHeight: 1.7, fontStyle: 'italic', margin: 0,
          }}>
            &ldquo;{scoutReport}&rdquo;
          </p>
        </div>

        {/* Tactical profile */}
        {squad && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16, marginBottom: 16,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
            }}>
              Tactical profile
            </p>
            {[
              { label: 'Style', value: squad.style },
              { label: 'Strength', value: squad.strength },
              { label: 'Watch for', value: squad.weakness },
            ].map(item => (
              <div key={item.label} style={{
                marginBottom: 10, paddingBottom: 10,
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Star players */}
        {squad?.starPlayers && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16, marginBottom: 16,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
            }}>
              Key players
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {squad.starPlayers.map(player => (
                <div key={player.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 10px',
                  background: 'var(--bg-elevated)', borderRadius: 8,
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 4, padding: '2px 5px', flexShrink: 0,
                    minWidth: 28, textAlign: 'center',
                  }}>
                    {player.position}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {player.club}
                      {player.caps && ` · ${player.caps} caps`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Link href={`/cards/${player.name.split(' ').pop()?.toLowerCase() ?? player.name.toLowerCase()}`}
                      style={{
                        fontSize: 10, color: 'var(--text-3)', textDecoration: 'none',
                        padding: '3px 7px', borderRadius: 5,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-card)',
                      }}>
                      Card
                    </Link>
                    <Link href="/characters/talentspotter" style={{
                      fontSize: 10, color: 'var(--green)', textDecoration: 'none',
                      padding: '3px 7px', borderRadius: 5,
                      border: '1px solid var(--green)',
                      background: 'var(--green-tint)',
                    }}>
                      Scout
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No squad data for this team */}
        {!squad && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 20, marginBottom: 16, textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
              Full squad details confirmed closer to June 11
            </div>
            <Link href="/characters/talentspotter" style={{
              fontSize: 12, color: 'var(--green)', textDecoration: 'none',
            }}>
              Ask TalentSpotter about {team.name} →
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href={`/h2h?teamA=${team.code}`} style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '11px 16px', textDecoration: 'none',
            fontSize: 13, color: 'var(--text)', minWidth: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            ⚔️ H2H history
          </Link>
          <Link href="/characters/talentspotter" style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '11px 16px', textDecoration: 'none',
            fontSize: 13, color: 'var(--text)', minWidth: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            🔍 Ask TalentSpotter
          </Link>
          <Link href="/characters/xg-oracle" style={{
            flex: 1, background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 10,
            padding: '11px 16px', textDecoration: 'none',
            fontSize: 13, color: 'var(--text)', minWidth: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            📊 Ask xG Oracle
          </Link>
        </div>

      </main>
      <BottomNav />
    </>
  )
}
