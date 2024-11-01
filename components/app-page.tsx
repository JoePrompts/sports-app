'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react"

export function Page() {
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
          <Input className="w-64" placeholder="Search leagues..." type="search" />
          <Button>Sign In</Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Next Sports League</h1>
        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Leagues</TabsTrigger>
            <TabsTrigger value="current">Current Leagues</TabsTrigger>
            <TabsTrigger value="past">Past Leagues</TabsTrigger>
          </TabsList>
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

function LeagueCard({ league }) {
  return (
    <Card className="overflow-hidden">
      <img src={league.image} alt={league.name} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle>{league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{league.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <CalendarDays className="w-4 h-4" />
          <span>{league.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{league.teamCount} teams</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View League</Button>
      </CardFooter>
    </Card>
  )
}

const upcomingLeagues = [
  {
    id: 1,
    name: "Summer Soccer Championship",
    location: "Los Angeles, CA",
    date: "Starts July 15, 2023",
    teamCount: 16,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    name: "Fall Basketball Tournament",
    location: "Chicago, IL",
    date: "Starts September 1, 2023",
    teamCount: 32,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    name: "Winter Ice Hockey League",
    location: "Toronto, Canada",
    date: "Starts November 15, 2023",
    teamCount: 12,
    image: "/placeholder.svg?height=200&width=400",
  },
]

const currentLeagues = [
  {
    id: 4,
    name: "Spring Tennis Open",
    location: "Miami, FL",
    date: "Ends June 30, 2023",
    teamCount: 64,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    name: "Volleyball Beach Series",
    location: "San Diego, CA",
    date: "Ends August 15, 2023",
    teamCount: 24,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    name: "City Football League",
    location: "New York, NY",
    date: "Ends July 31, 2023",
    teamCount: 20,
    image: "/placeholder.svg?height=200&width=400",
  },
]

const pastLeagues = [
  {
    id: 7,
    name: "Winter Ski Championship",
    location: "Aspen, CO",
    date: "Ended March 15, 2023",
    teamCount: 50,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 8,
    name: "Spring Baseball Classic",
    location: "Phoenix, AZ",
    date: "Ended May 1, 2023",
    teamCount: 30,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 9,
    name: "National Rugby Tournament",
    location: "Boston, MA",
    date: "Ended April 30, 2023",
    teamCount: 16,
    image: "/placeholder.svg?height=200&width=400",
  },
]