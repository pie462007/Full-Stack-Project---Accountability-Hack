import { useState } from 'react'
import '../styles/HabitDetails.css'

const HabitDetails = ({ habit, onDelete }) => { // add onDelete to chagne UI on deletion

    const handleDelete = async () => {
        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            onDelete(habit._id) // Update UI after deletion
        }
    }

    const [completed, setCompleted] = useState(false)
    const handleCompleted = () => {
        setCompleted(prev => !prev)
    }

    return (
        <div className={`habit-details ${completed ? 'completed' : ''}`}>
            <div className="habit.title">
                <h4 className={completed ? 'strikethrough' : ''}>{habit.title}</h4>
                {completed && <span className="completed-box">Completed</span>}
            </div>
            <p><strong>Description: </strong>{habit.description}</p>
            <p>{habit.createdAt}</p>
            <button onClick={handleCompleted}>
                {completed ? 'undo complete' : 'mark as complete'}
            </button>
            <button onClick={handleDelete}>delete habit</button>
        </div>
    )
}

export default HabitDetails