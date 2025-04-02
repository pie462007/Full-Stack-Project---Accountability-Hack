import { useEffect, useState } from 'react'

// components
import HabitDetails from '../components/HabitDetails'
import HabitForm from '../components/HabitForm'

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

    const handleDelete = (deletedId) => {
        setHabits(prevHabits => 
            prevHabits.filter(habit => habit._id !== deletedId)
        );
    };


    return (
        <div className="home">
            <div class="habits">
                {habits && habits.map((habit) => (
                    <HabitDetails key={habit._id} habit={habit} onDelete={handleDelete}  />
                ))}
            </div>
            <HabitForm setHabits={setHabits} />
        </div>
    )
}

export default Home