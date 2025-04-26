import { useEffect } from 'react'
import '../styles/Home.css'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// components
import HabitCard from '../components/HabitCard'
import HabitForm from '../components/HabitForm'
import HabitCalendar from '../components/HabitCalendar'

const Home = () => {
    const {habits, dispatch} = useHabitsContext()
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
                dispatch({type: 'SET_HABITS', payload: json})
            }
        }
        if (user) {
            fetchHabits()
        }
    }, [user, dispatch])

    return (
        <div className="home">
            <div className="habits">
                {habits && habits.map((habit) => (
                    <HabitCard key={habit._id} habit={habit} />
                ))}
                <HabitForm/>
            </div>
            <div className="calendar-container">
                <HabitCalendar habits={habits} />
            </div>
        </div>
    )
}

export default Home