'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { MapPin, Trophy, Users, PlusCircle } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface City {
  id: number
  name: string
  state: string
  country: string
  created_at: string
}

interface Sport {
  id: number
  name: string
  description: string
  players_per_team: number
  created_at: string
}

interface League {
  id: number
  name: string
  city_id: number
  sport_id: number
  max_teams: number
  start_date: string
  end_date: string
  registration_deadline: string
  status: string
  image: string
  created_at: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cities')
  const [cities, setCities] = useState<City[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'cities':
          const { data: citiesData } = await supabase
            .from('cities')
            .select('*')
            .order('name')
          setCities(citiesData || [])
          break

        case 'sports':
          const { data: sportsData } = await supabase
            .from('sports')
            .select('*')
            .order('name')
          setSports(sportsData || [])
          break

        case 'leagues':
          const { data: leaguesData } = await supabase
            .from('leagues')
            .select('*')
            .order('name')
          setLeagues(leaguesData || [])
          break
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>
    }

    switch (activeTab) {
      case 'cities':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">Country</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{city.id}</td>
                    <td className="px-6 py-4">{city.name}</td>
                    <td className="px-6 py-4">{city.state}</td>
                    <td className="px-6 py-4">{city.country}</td>
                    <td className="px-6 py-4">{format(new Date(city.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'sports':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Players Per Team</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sports.map((sport) => (
                  <tr key={sport.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{sport.id}</td>
                    <td className="px-6 py-4">{sport.name}</td>
                    <td className="px-6 py-4">{sport.description}</td>
                    <td className="px-6 py-4">{sport.players_per_team}</td>
                    <td className="px-6 py-4">{format(new Date(sport.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'leagues':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">City ID</th>
                  <th className="px-6 py-3">Sport ID</th>
                  <th className="px-6 py-3">Max Teams</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Registration Deadline</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leagues.map((league) => (
                  <tr key={league.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{league.id}</td>
                    <td className="px-6 py-4">{league.name}</td>
                    <td className="px-6 py-4">{league.city_id}</td>
                    <td className="px-6 py-4">{league.sport_id}</td>
                    <td className="px-6 py-4">{league.max_teams}</td>
                    <td className="px-6 py-4">{format(new Date(league.start_date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">{format(new Date(league.end_date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">{format(new Date(league.registration_deadline), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">{league.status}</td>
                    <td className="px-6 py-4">{format(new Date(league.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeTab === 'cities' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('cities')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Cities
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'sports' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sports')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Sports
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === 'leagues' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('leagues')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Leagues
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
          <Button variant="outline" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {activeTab.slice(0, -1)}
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
} 