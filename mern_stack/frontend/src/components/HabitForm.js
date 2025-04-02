import { useState } from "react"

const HabitForm = ({setHabits}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const habit = {title, description}

        const response = await fetch('/api/habits', {
            method: 'POST',
            body: JSON.stringify(habit),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setTitle('')
            setDescription('')
            setError(null)
        
            const updatedHabits = await fetch("api/habits").then((res) =>res.json());
            setHabits(updatedHabits);
            console.log('new habit added', json)
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a new Habit</h3>

            <label>Habit Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <label>Description:</label>
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />

            <button>Add Habit</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default HabitForm