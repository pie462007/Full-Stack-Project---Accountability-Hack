//import { useEffect, useState } from 'react'
//import '../styles/HabitDetails.css'
import { useEffect, useState } from 'react'
import '../styles/HabitCard.css'
import Popup from './UpdatePopup'

const HabitCard = ({ habit, onDelete }) => { // add onDelete to chagne UI on deletion
    const [buttonPopup, setButtonPopup] = useState(false)
    const [titleInput, setTitleInput] = useState(habit.title)
    const [descriptionInput, setDescriptionInput] = useState(habit.description)
    const [error, setError] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [habitData, setHabitData] = useState(null)

    useEffect(() => {
        const fetchHabitData = async () => {
            try {
                const response = await fetch(`/api/habits/${habit._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch habit data');
                }
                const data = await response.json();
                setHabitData(data); // Store the habit data, including streak info
            } catch (error) {
                console.error('Error fetching habit data:', error);
            }
        };
        fetchHabitData();
    }, [habit._id]); // Runs when `habit._id` changes

    
    const handleDelete = async () => {
        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            onDelete(habit._id) // Update UI after deletion
        }
    }

    //const [completed, setCompleted] = useState(false)
    //const handleCompleted = () => {
    //    setCompleted(prev => !prev)
    //}

    const handleCompleted = async () => {
        setCompleted(prev => !prev)
        console.log('complete button clicked')
        const response = await fetch(`/api/habits/${habit._id}/complete`, {
            method: 'PATCH', 
            //body: JSON.stringify({ completed: !completed }),
	        body: JSON.stringify({ completed: true }), 
            headers: { 'Content-Type': 'application/json' },
        })

        const updateCompletion = await response.json();
        setHabitData(updateCompletion);
        console.log('Updated Habit: ', updateCompletion)
        //setHabitData(updateCompletion);

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
        <div className={`habit-card ${completed ? 'completed' : ''}`}>
            <div className="habit-info">
                <h3 className={completed ? 'strikethrough' : ''}>{habit.title}</h3>
                <p>{habit.description}</p>
                <p>{habit.createdAt}</p>
            </div>
            <div className="actions-bottom-right">
                <p className="streak-text">Streak: {habit.currentStreak}</p>
                <button onClick={handleCompleted}>
            {completed ? 'Undo Complete' : 'Mark as Complete'}
            </button>
        </div>
        <div className="dropdown">
            <button className="menu-btn">•••</button>
            <div className="dropdown-content">
                <a onClick={enableUpdate} href="#">Edit</a>
                <a onClick={handleDelete} href="#" className="delete-option">Delete</a>
            </div>
        </div>
    </div>

        //<div className = "habit-card">
        //    <div className = "habit-info">
        //        <h3>{habit.title}</h3>
        //        <p>{habit.description}</p>
        //        <p>{habit.createdAt}</p>
        //    </div>
        //    <div className="dropdown">
        //        <button className="menu-btn">•••</button>
        //        <div className="dropdown-content">
        //            <a onClick={enableUpdate} href="#">Edit</a>
        //            <a onClick={handleDelete} href="#" className="delete-option">Delete</a>
        //        </div>
        //    </div>
        //</div>


        // <div className={`habit-details ${completed ? 'completed' : ''}`}>
        //     <div className="habit.title">
        //         <h4 className={completed ? 'strikethrough' : ''}>{habit.title}</h4>
        //         {completed && <span className="completed-box">Completed</span>}
        //     </div>
        //     <p><strong>Description: </strong>{habit.description}</p>
        //     <p>{habit.createdAt}</p>
        //     <button onClick={handleCompleted}>
        //         {completed ? 'undo complete' : 'mark as complete'}
        //     </button>
        //     <button onClick={handleDelete}>delete habit</button>
        //     <button onClick={enableUpdate}>update habit</button>
        // </div>
    )
}

export default HabitCard