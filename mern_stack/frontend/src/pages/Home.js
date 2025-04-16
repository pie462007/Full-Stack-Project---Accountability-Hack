import { useEffect, useState } from 'react'
import '../styles/Home.css'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import HabitCard from '../components/HabitCard'
import HabitForm from '../components/HabitForm'

const Home = () => {
    const [habits, setHabits] = useState(null)
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchHabits = async () => {
            const response = await fetch('/api/habits', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                setHabits(json)
            }
        }
        if (user) {
            fetchHabits()
        }
        else {
            console.error("error fetching habits");
        }
    }, [user])

    const handleDelete = (deletedId) => {
        setHabits(prevHabits => 
            prevHabits.filter(habit => habit._id !== deletedId)
        );
    };


    return (
        <div className="home">
            <div class="habits">
                {habits && habits.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} onDelete={handleDelete}  />
                ))}
            </div>
            <HabitForm setHabits={setHabits} />
        </div>
    )
}

export default Home