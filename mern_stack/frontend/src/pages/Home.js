import { useEffect, useState } from 'react'

// components
import HabitDetails from '../components/HabitDetails'

const Home = () => {
    const [habits, setHabits] = useState(null)

    useEffect(() => {
        const fetchHabits = async () => {
            const response = await fetch('/api/habits')
            const json = await response.json()

            if (response.ok) {
                setHabits(json)
            }
        }

        fetchHabits()
    }, [])

    return (
        <div className="home">
            <div class="habits">
                {habits && habits.map((habit) => (
                    <HabitDetails key={habit._id} habit={habit} />
                ))}
            </div>
        </div>
    )
}

export default Home