import { useState } from 'react'
import '../styles/HabitDetails.css'
import Popup from './UpdatePopup'

const HabitDetails = ({ habit, onDelete }) => { // add onDelete to chagne UI on deletion
    const [buttonPopup, setButtonPopup] = useState(false)
    const [titleInput, setTitleInput] = useState(habit.title)
    const [descriptionInput, setDescriptionInput] = useState(habit.description)
    const [error, setError] = useState(null)

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

    const handleUpdate = async (e) => {
        e.preventDefault()


        const response = await fetch('/api/habits', {
            method: 'PATCH',
            body: JSON.stringify({
                updatedTitle: titleInput,
                updatedDescription: descriptionInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
            updateDefaultValues(habit.title, habit.description)
        }
        else{
            updateDefaultValues(titleInput, descriptionInput)
        }
    }

    const updateDefaultValues = async (defaultTitle, defaultDescription) => {
        setTitleInput(defaultTitle)
        setDescriptionInput(defaultDescription)
    }

    const enableUpdate = async () => {
        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'GET'
        })

        if (response.ok){
            setButtonPopup(true);
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <p>Change the title and/or description, but neither must be empty</p>
                <label>Title:</label>
                <input
                    type="text"
                    onChange={(e) => setTitleInput(e.target.value)}
                    value={titleInput}
                />

                <label>Description:</label>
                <input
                    type="text"
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    value={descriptionInput}
                />
                <button>onClick={handleUpdate}confirm</button>
            </Popup>
        }
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
            <button onClick={enableUpdate}>update habit</button>
        </div>
    )
}

export default HabitDetails