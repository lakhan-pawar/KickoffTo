// src/lib/players.ts

export interface SquadPlayer {
  id: number
  name: string
  age: number
  position: string
  photo: string
  club: string
  clubLogo: string
  shirtNumber: number
  nationality: string
  countryCode: string
  injured: boolean
}

// Minimal mock data for type safety and development
export const MOCK_SQUAD: SquadPlayer[] = [
  { 
    id: 154, 
    name: 'Lionel Messi', 
    age: 37, 
    position: 'Attacker', 
    photo: '', 
    club: 'Inter Miami', 
    clubLogo: '', 
    shirtNumber: 10, 
    nationality: 'Argentina', 
    countryCode: 'ar', 
    injured: false 
  }
]
