'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Pencil, Trash2, MapPin, Trophy, Users, Search } from "lucide-react"
import { formatDate } from '@/lib/utils'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Add interfaces for our data types
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
  cities?: { name: string }
  sports?: { name: string }
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('cities')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Update state with proper types
  const [cities, setCities] = useState<City[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [leagues, setLeagues] = useState<League[]>([])

  // Form states
  const [newCity, setNewCity] = useState({
    name: '',
    state: '',
    country: ''
  })

  const [newSport, setNewSport] = useState({
    name: '',
    description: '',
    players_per_team: ''
  })

  const [newLeague, setNewLeague] = useState({
    name: '',
    city_id: '',
    sport_id: '',
    max_teams: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    status: 'upcoming',
    image: ''
  })

  // Filter functions
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSports = sports.filter(sport => 
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLeagues = leagues.filter(league => 
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get the correct filtered data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'cities':
        return filteredCities
      case 'sports':
        return filteredSports
      case 'leagues':
        return filteredLeagues
      default:
        return []
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch cities
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (citiesError) throw citiesError
      setCities(citiesData || [])

      // Fetch sports
      const { data: sportsData, error: sportsError } = await supabase
        .from('sports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (sportsError) throw sportsError
      setSports(sportsData || [])

      // Fetch leagues with city and sport names
      const { data: leaguesData, error: leaguesError } = await supabase
        .from('leagues')
        .select(`
          *,
          cities(name),
          sports(name)
        `)
        .order('created_at', { ascending: false })
      
      if (leaguesError) throw leaguesError
      setLeagues(leaguesData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  // CRUD operations for cities
  const addCity = async (newCity) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .insert([newCity])
        .select()
        .single()

      if (error) throw error
      setCities([data, ...cities])
      return true
    } catch (error) {
      console.error('Error adding city:', error)
      alert('Error adding city')
      return false
    }
  }

  const updateCity = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setCities(cities.map(city => city.id === id ? data : city))
      return true
    } catch (error) {
      console.error('Error updating city:', error)
      alert('Error updating city')
      return false
    }
  }

  const deleteCity = async (id: number) => {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCities(cities.filter(city => city.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting city:', error)
      alert('Error deleting city')
      return false
    }
  }

  // CRUD operations for sports
  const addSport = async (newSport) => {
    try {
      const { data, error } = await supabase
        .from('sports')
        .insert([newSport])
        .select()
        .single()

      if (error) throw error
      setSports([data, ...sports])
      return true
    } catch (error) {
      console.error('Error adding sport:', error)
      alert('Error adding sport')
      return false
    }
  }

  const updateSport = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('sports')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setSports(sports.map(sport => sport.id === id ? data : sport))
      return true
    } catch (error) {
      console.error('Error updating sport:', error)
      alert('Error updating sport')
      return false
    }
  }

  const deleteSport = async (id: number) => {
    try {
      const { error } = await supabase
        .from('sports')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSports(sports.filter(sport => sport.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting sport:', error)
      alert('Error deleting sport')
      return false
    }
  }

  // CRUD operations for leagues
  const addLeague = async (newLeague) => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .insert([newLeague])
        .select(`
          *,
          cities(name),
          sports(name)
        `)
        .single()

      if (error) throw error
      setLeagues([data, ...leagues])
      return true
    } catch (error) {
      console.error('Error adding league:', error)
      alert('Error adding league')
      return false
    }
  }

  const updateLeague = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          cities(name),
          sports(name)
        `)
        .single()

      if (error) throw error
      setLeagues(leagues.map(league => league.id === id ? data : league))
      return true
    } catch (error) {
      console.error('Error updating league:', error)
      alert('Error updating league')
      return false
    }
  }

  const deleteLeague = async (id: number) => {
    try {
      const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('id', id)

      if (error) throw error
      setLeagues(leagues.filter(league => league.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting league:', error)
      alert('Error deleting league')
      return false
    }
  }

  // Update your handleAdd, handleEdit, handleDelete functions to use these new CRUD operations
  const handleAdd = async (type: string) => {
    let success = false
    
    if (type === 'cities') {
      success = await addCity(newCity)
    } else if (type === 'sports') {
      success = await addSport(newSport)
    } else if (type === 'leagues') {
      success = await addLeague(newLeague)
    }

    if (success) {
      // Reset form states
      setNewCity({ name: '', state: '', country: '' })
      setNewSport({ name: '', description: '', players_per_team: '' })
      setNewLeague({
        name: '',
        city_id: '',
        sport_id: '',
        max_teams: '',
        start_date: '',
        end_date: '',
        registration_deadline: '',
        status: 'upcoming',
        image: ''
      })
    }
  }

  const handleEditCity = (id: number) => {
    setCities(cities.map(city => 
      city.id === id ? { ...city, isEditing: !city.isEditing } : city
    ))
  }

  const handleUpdateCity = (id: number, newName: string) => {
    setCities(cities.map(city => 
      city.id === id ? { ...city, name: newName, isEditing: false } : city
    ))
  }

  const handleDelete = (id: number, type: string) => {
    if (type === 'cities') {
      setCities(cities.filter(city => city.id !== id))
    } else if (type === 'sports') {
      setSports(sports.filter(sport => sport.id !== id))
    } else {
      setLeagues(leagues.filter(league => league.id !== id))
    }
  }

  const renderTable = (items: any[], type: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          {type === 'cities' && (
            <>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </>
          )}
          {type === 'sports' && (
            <>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Players per Team</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </>
          )}
          {type === 'leagues' && (
            <>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Max Teams</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Registration Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            {type === 'cities' && (
              <>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditCity(item.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id, type)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </>
            )}
            {type === 'sports' && (
              <>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.players_per_team}</TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item, type)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id, type)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </>
            )}
            {type === 'leagues' && (
              <>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.city_id}</TableCell>
                <TableCell>{item.sport_id}</TableCell>
                <TableCell>{item.max_teams}</TableCell>
                <TableCell>{formatDate(item.start_date)}</TableCell>
                <TableCell>{formatDate(item.end_date)}</TableCell>
                <TableCell>{formatDate(item.registration_deadline)}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                </TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item, type)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id, type)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderAddButton = () => {
    switch (activeTab) {
      case 'cities':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                addCity(newCity)
              }} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCity.name}
                      onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                      placeholder="Enter city name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newCity.state}
                      onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newCity.country}
                      onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
                <Button type="submit">Add City</Button>
              </form>
            </DialogContent>
          </Dialog>
        )

      case 'sports':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Sport
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sport</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                addSport(newSport)
              }} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newSport.name}
                      onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                      placeholder="Enter sport name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newSport.description}
                      onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="players">Players per Team</Label>
                    <Input
                      id="players"
                      type="number"
                      value={newSport.players_per_team}
                      onChange={(e) => setNewSport({ ...newSport, players_per_team: e.target.value })}
                      placeholder="Enter number of players"
                    />
                  </div>
                </div>
                <Button type="submit">Add Sport</Button>
              </form>
            </DialogContent>
          </Dialog>
        )

      case 'leagues':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add League
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New League</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                // Format dates properly before submission
                const formattedLeague = {
                  ...newLeague,
                  start_date: newLeague.start_date ? new Date(newLeague.start_date).toISOString() : null,
                  end_date: newLeague.end_date ? new Date(newLeague.end_date).toISOString() : null,
                  registration_deadline: newLeague.registration_deadline ? new Date(newLeague.registration_deadline).toISOString() : null,
                }
                addLeague(formattedLeague)
              }} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newLeague.name}
                      onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                      placeholder="Enter league name"
                    />
                  </div>
                  
                  {/* City and Sport dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <select
                        id="city"
                        value={newLeague.city_id}
                        onChange={(e) => setNewLeague({ ...newLeague, city_id: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sport">Sport</Label>
                      <select
                        id="sport"
                        value={newLeague.sport_id}
                        onChange={(e) => setNewLeague({ ...newLeague, sport_id: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select a sport</option>
                        {sports.map(sport => (
                          <option key={sport.id} value={sport.id}>{sport.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="max_teams">Maximum Teams</Label>
                    <Input
                      id="max_teams"
                      type="number"
                      value={newLeague.max_teams}
                      onChange={(e) => setNewLeague({ ...newLeague, max_teams: e.target.value })}
                      placeholder="Enter maximum teams"
                    />
                  </div>

                  {/* Date pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newLeague.start_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newLeague.start_date ? format(new Date(newLeague.start_date), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newLeague.start_date ? new Date(newLeague.start_date) : undefined}
                            onSelect={(date) => setNewLeague({ ...newLeague, start_date: date?.toISOString() || '' })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newLeague.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newLeague.end_date ? format(new Date(newLeague.end_date), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newLeague.end_date ? new Date(newLeague.end_date) : undefined}
                            onSelect={(date) => setNewLeague({ ...newLeague, end_date: date?.toISOString() || '' })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Registration Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newLeague.registration_deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newLeague.registration_deadline ? format(new Date(newLeague.registration_deadline), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newLeague.registration_deadline ? new Date(newLeague.registration_deadline) : undefined}
                          onSelect={(date) => setNewLeague({ ...newLeague, registration_deadline: date?.toISOString() || '' })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newLeague.image}
                      onChange={(e) => setNewLeague({ ...newLeague, image: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={newLeague.status}
                      onChange={(e) => setNewLeague({ ...newLeague, status: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <Button type="submit">Add League</Button>
              </form>
            </DialogContent>
          </Dialog>
        )
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'cities':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Cities</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add City
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New City</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cityName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="cityName"
                        value={newCity.name}
                        onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cityState" className="text-right">
                        State
                      </Label>
                      <Input
                        id="cityState"
                        value={newCity.state}
                        onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cityCountry" className="text-right">
                        Country
                      </Label>
                      <Input
                        id="cityCountry"
                        value={newCity.country}
                        onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleAdd('cities')}>Add City</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {renderTable(filteredCities, 'cities')}
          </>
        )
      case 'sports':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Sports</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Sport
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sport</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sportName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="sportName"
                        value={newSport.name}
                        onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sportDescription" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="sportDescription"
                        value={newSport.description}
                        onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sportPlayersPerTeam" className="text-right">
                        Players per Team
                      </Label>
                      <Input
                        id="sportPlayersPerTeam"
                        value={newSport.players_per_team}
                        onChange={(e) => setNewSport({ ...newSport, players_per_team: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleAdd('sports')}>Add Sport</Button>
                </DialogContent>
              </Dialog>
            </div>
            {renderTable(sports, 'sports')}
          </>
        )
      case 'leagues':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Leagues</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add League
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New League</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="leagueName"
                        value={newLeague.name}
                        onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueCityId" className="text-right">
                        City
                      </Label>
                      <Input
                        id="leagueCityId"
                        value={newLeague.city_id}
                        onChange={(e) => setNewLeague({ ...newLeague, city_id: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueSportId" className="text-right">
                        Sport
                      </Label>
                      <Input
                        id="leagueSportId"
                        value={newLeague.sport_id}
                        onChange={(e) => setNewLeague({ ...newLeague, sport_id: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueMaxTeams" className="text-right">
                        Max Teams
                      </Label>
                      <Input
                        id="leagueMaxTeams"
                        value={newLeague.max_teams}
                        onChange={(e) => setNewLeague({ ...newLeague, max_teams: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueStartDate" className="text-right">
                        Start Date
                      </Label>
                      <Input
                        id="leagueStartDate"
                        value={newLeague.start_date}
                        onChange={(e) => setNewLeague({ ...newLeague, start_date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueEndDate" className="text-right">
                        End Date
                      </Label>
                      <Input
                        id="leagueEndDate"
                        value={newLeague.end_date}
                        onChange={(e) => setNewLeague({ ...newLeague, end_date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueRegistrationDeadline" className="text-right">
                        Registration Deadline
                      </Label>
                      <Input
                        id="leagueRegistrationDeadline"
                        value={newLeague.registration_deadline}
                        onChange={(e) => setNewLeague({ ...newLeague, registration_deadline: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueStatus" className="text-right">
                        Status
                      </Label>
                      <Input
                        id="leagueStatus"
                        value={newLeague.status}
                        onChange={(e) => setNewLeague({ ...newLeague, status: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leagueImage" className="text-right">
                        Image
                      </Label>
                      <Input
                        id="leagueImage"
                        value={newLeague.image}
                        onChange={(e) => setNewLeague({ ...newLeague, image: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleAdd('leagues')}>Add League</Button>
                </DialogContent>
              </Dialog>
            </div>
            {renderTable(leagues, 'leagues')}
          </>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
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
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {renderAddButton()}
        </div>
        {renderTable(getFilteredData(), activeTab)}
      </main>
    </div>
  )
} 