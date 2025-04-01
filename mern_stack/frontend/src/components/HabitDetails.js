import { useState } from 'react'

const HabitDetails = ({ habit }) => { // add onDelete to chagne UI on deletion

    const handleDelete = async () => {
        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            //onDelete(habit._id) // Update UI after deletion
        }
    }

    return (
        <div className="habit-details">
            <h4>{habit.title}</h4>
            <p><strong>Description: </strong>{habit.description}</p>
            <p>{habit.createdAt}</p>
            <button>mark as complete</button>
            <button onClick={handleDelete}>delete habit</button>
        </div>
    )
}

export default HabitDetails