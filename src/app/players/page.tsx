import { redirect } from 'next/navigation'

export default function PlayersIndexPage() {
  // Redirect to the teams hub which lists all featured players
  redirect('/teams')
}
