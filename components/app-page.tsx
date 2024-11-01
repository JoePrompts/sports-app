'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { League } from '@/types/database'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react"
import { CreateLeagueForm } from '@/components/create-league-form'

export function Page() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const { data, error } = await supabase
          .from('leagues')
          .select(`
            *,
            cities (
              name,
              state
            )
          `)
          .eq('sport_id', 1) // Assuming 1 is soccer's ID
          .order('start_date', { ascending: true })

        if (error) throw error

        setLeagues(data || [])
      } catch (e) {
        console.error('Error fetching leagues:', e)
        setError('Failed to load leagues')
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  if (loading) return <div>Loading leagues...</div>
  if (error) return <div>Error: {error}</div>

  const upcomingLeagues = leagues.filter(league => league.status === 'upcoming')
  const currentLeagues = leagues.filter(league => league.status === 'current')
  const pastLeagues = leagues.filter(league => league.status === 'past')

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <span className="text-xl font-bold">SportsLeague</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/leagues" className="text-sm font-medium hover:underline">
            Leagues
          </Link>
          <Link href="/teams" className="text-sm font-medium hover:underline">
            Teams
          </Link>
          <Link href="/players" className="text-sm font-medium hover:underline">
            Players
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <CreateLeagueForm />
          <Button>Sign In</Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Next Soccer League</h1>
        <Tabs defaultValue="upcoming" className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Leagues</TabsTrigger>
              <TabsTrigger value="current">Current Leagues</TabsTrigger>
              <TabsTrigger value="past">Past Leagues</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Input 
                className="w-full" 
                placeholder="Search by city..." 
                type="search"
              />
              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © 2023 SportsLeague. All rights reserved.
      </footer>
    </div>
  )
}

function LeagueCard({ league }: { league: League }) {
  return (
    <Card className="overflow-hidden">
      <img src={league.image} alt={league.name} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{league.cities?.name}, {league.cities?.state}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <CalendarDays className="w-4 h-4" />
          <span>Starts {new Date(league.start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>Max {league.max_teams} teams</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View League</Button>
      </CardFooter>
    </Card>
  )
}