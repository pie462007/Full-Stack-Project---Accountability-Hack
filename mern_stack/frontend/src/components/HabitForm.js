import { useState } from "react";
import '../styles/HabitForm.css'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useAuthContext } from "../hooks/useAuthContext";

const HabitForm = ({}) => {
    const { dispatch } = useHabitsContext()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {user} = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in")
            return
        }

        const habit = { title, description, frequency };

        const response = await fetch('/api/habits', {
            method: 'POST',
            body: JSON.stringify(habit),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            setTitle('');
            setDescription('');
            setFrequency('daily');
            setError(null);
            console.log('new habit added', json);
            dispatch({type: 'CREATE_HABIT', payload: json})

            setIsPopupOpen(false); // Close the popup after successful submission
        }
    };

    return (
        <div>
            <button className="add-habit-btn" onClick={() => setIsPopupOpen(true)}>Add New Habit</button>
    
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="cancel" onClick={() => setIsPopupOpen(false)}>
                            &times;
                        </button>
                        <form className="create" onSubmit={handleSubmit}>
                            <h3>Add a new Habit</h3>
                            <p>What habit would you like to start building?</p>
    
                            <label>Habit Title: </label>
                            <input
                                type="text"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
    
                            <label>Description: </label>
                            <input
                                type="text"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />

                            <label>Frequency: </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
    
                            <button>Add Habit</button>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitForm;