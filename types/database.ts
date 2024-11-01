export interface City {
  id: number
  name: string
  state: string
  country: string
}

export interface League {
  id: number
  name: string
  city_id: number
  sport_id: number
  max_teams: number
  start_date: string
  end_date: string
  registration_deadline: string
  status: 'upcoming' | 'current' | 'past'
  image: string
  city?: City // Optional joined data
} 