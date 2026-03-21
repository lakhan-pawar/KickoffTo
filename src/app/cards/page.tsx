import { redirect } from 'next/navigation'

export default function CardsIndexPage() {
  // Redirect to the teams hub where users can find players to generate cards for
  redirect('/teams')
}
