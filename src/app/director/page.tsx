import { redirect } from 'next/navigation'

export default function DirectorIndexPage() {
  // Redirect to a default match for now (Argentina vs France 2022 is the classic example)
  redirect('/director/mock-arg-fra')
}
