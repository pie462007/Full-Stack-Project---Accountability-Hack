import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const HabitForm = ({ setHabits }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {user} = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in")
            return
        }

        const habit = { title, description };

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
            setError(null);

            const updatedHabits = await fetch('/api/habits').then((res) => res.json());
            setHabits(updatedHabits);
            console.log('new habit added', json);

            setIsPopupOpen(false); // Close the popup after successful submission
        }
    };

    return (
        <div>
            <button onClick={() => setIsPopupOpen(true)}>Add New Habit</button> {/* Button to open popup */}
    
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-inner"> {/* Updated class name */}
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
    
                            <label> Description: </label>
                            <input
                                type="text"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
    
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