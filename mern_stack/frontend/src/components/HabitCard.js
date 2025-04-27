//import { useEffect, useState } from 'react'
//import '../styles/HabitDetails.css'
import { useEffect, useState } from 'react'
import '../styles/HabitCard.css'
import Popup from './Popup'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import HabitCalendar from './HabitCalendar'

const HabitCard = ({ habit}) => { 
    const { dispatch } = useHabitsContext()
    const [buttonPopup, setButtonPopup] = useState(false)
    const [titleInput, setTitleInput] = useState(habit.title)
    const [descriptionInput, setDescriptionInput] = useState(habit.description)
    const [error, setError] = useState(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [habitData, setHabitData] = useState({
        title: habit.title,
        description: habit.description,
        completions: habit.completions || [],
        frequency: habit.frequency || 'daily'
    })
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchHabitData = async () => {
            try {
                const response = await fetch(`/api/habits/${habit._id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch habit data');
                }
                const data = await response.json();
                setHabitData(data);
                // Check if habit is completed today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                setIsCompleted((data.completions || []).some(completion => {
                    const completionDate = new Date(completion);
                    completionDate.setHours(0, 0, 0, 0);
                    return completionDate.getTime() === today.getTime();
                }));
            } catch (error) {
                console.error('Error fetching habit data:', error);
            }
        };
        
        fetchHabitData();
    }, [habit._id]);

    useEffect(() => {
        if (habit && habit._id) {
            setHabitData(habit);
        }
    }, [habit]);
    
    // Add timer to check date at midnight
    useEffect(() => {
        let isUpdating = false; // Flag to prevent concurrent updates

        const checkDate = async () => {
            if (isUpdating) return; // Skip if already updating
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Check based on habit frequency
            let isCompletedToday = false;
            
            if (habit.frequency === 'daily') {
                isCompletedToday = (habitData.completions || []).some(completion => {
                    const completionDate = new Date(completion);
                    completionDate.setHours(0, 0, 0, 0);
                    return completionDate.getTime() === today.getTime();
                });
            } else if (habit.frequency === 'weekly') {
                const getWeekBoundary = (date) => {
                    const d = new Date(date);
                    d.setUTCHours(0, 0, 0, 0);
                    const dayOfWeek = d.getUTCDay();
                    if (dayOfWeek === 0) {
                        return d.getTime();
                    } else {
                        d.setUTCDate(d.getUTCDate() - dayOfWeek);
                        return d.getTime();
                    }
                };
                
                const todayBoundary = getWeekBoundary(today);
                isCompletedToday = (habitData.completions || []).some(completion => {
                    const completionDate = new Date(completion);
                    return getWeekBoundary(completionDate) === todayBoundary;
                });
            } else if (habit.frequency === 'monthly') {
                isCompletedToday = (habitData.completions || []).some(completion => {
                    const completionDate = new Date(completion);
                    return completionDate.getFullYear() === today.getFullYear() && 
                           completionDate.getMonth() === today.getMonth();
                });
            }
            
            // Only update if the completion status has changed
            if (isCompletedToday !== isCompleted) {
                try {
                    isUpdating = true;
                    const response = await fetch(`/api/habits/${habit._id}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    
                    if (response.ok) {
                        const updatedHabit = await response.json();
                        setHabitData(updatedHabit);
                        setIsCompleted(isCompletedToday);
                        
                        // Dispatch the update to the context
                        dispatch({
                            type: 'TOGGLE_COMPLETE',
                            payload: updatedHabit
                        });
                    }
                } catch (error) {
                    console.error('Error updating habit status:', error);
                } finally {
                    isUpdating = false;
                }
            }
        };

        // Check immediately
        checkDate();

        // Set up interval to check every minute
        const interval = setInterval(checkDate, 60000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(interval);
            isUpdating = false;
        };
    }, [habitData.completions, habit.frequency, dispatch, user.token, habit._id]);
    
    const handleDelete = async () => { 
        if (!user) {
            return
        }
        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_HABIT', payload: json})
        }
    }

    const handleCompleted = async () => {
        setIsCompleted((prev) => !prev);
    
        try {
            const response = await fetch(`/api/habits/${habit._id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });
    
            const updatedHabit = await response.json();
    
            if (response.ok) {
                setHabitData(updatedHabit);
    
                // Dispatch an action to update the global context state
                dispatch({
                    type: 'TOGGLE_COMPLETE',
                    payload: updatedHabit
                });
            }
        } catch (error) {
            console.error('Error completing habit:', error);
            setIsCompleted((prev) => !prev); // Revert the state if there's an error
        }
    };
    

    // Get last completed date
    const getLastCompletedDate = () => {
        if (!habitData.completions || habitData.completions.length === 0) {
            return 'Never completed';
        }
        
        try {
            // Filter out any invalid dates and convert to Date objects
            const validDates = habitData.completions
                .filter(date => date && !isNaN(new Date(date).getTime()))
                .map(date => new Date(date));
            
            if (validDates.length === 0) {
                return 'Never completed';
            }
            
            // Get the most recent date
            const lastCompletion = new Date(Math.max(...validDates));
            return lastCompletion.toLocaleDateString();
        } catch (error) {
            console.error('Error formatting last completed date:', error);
            return 'Never completed';
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        // Validate inputs
        if (!titleInput.trim() || !descriptionInput.trim()) {
            setError('Title and description cannot be empty');
            return;
        }

        const response = await fetch(`/api/habits/${habit._id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: titleInput,
                description: descriptionInput
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
            updateDefaultValues(habitData.title, habitData.description)
        }
        else{  
            const updatedHabit = {
                ...json,
                completions: json.completions || []
            };
            setHabitData(updatedHabit);
            dispatch({
                type: 'UPDATE_HABIT',
                payload: updatedHabit
            });
            setButtonPopup(false)
            updateDefaultValues(titleInput, descriptionInput)
        }
    }

    const updateDefaultValues = async (defaultTitle, defaultDescription) => {
        setTitleInput(defaultTitle)
        setDescriptionInput(defaultDescription)
        setHabitData(prevData => ({
            ...prevData,
            title: defaultTitle,
            description: defaultDescription,
            completions: prevData.completions || []
        }))
    }

    const enableUpdate = async () => {
        try {
            const response = await fetch(`/api/habits/${habit._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const updatedHabit = await response.json();
                // Ensure completions array is initialized
                const habitWithCompletions = {
                    ...updatedHabit,
                    completions: updatedHabit.completions || [],
                    frequency: updatedHabit.frequency || 'daily',
                    currentStreak: updatedHabit.currentStreak || 0
                };
                setTitleInput(updatedHabit.title);
                setDescriptionInput(updatedHabit.description);
                setHabitData(habitWithCompletions);
                // Dispatch the update to the global state
                dispatch({
                    type: 'UPDATE_HABIT',
                    payload: habitWithCompletions
                });
                setButtonPopup(true);
            }
        } catch (error) {
            console.error('Error fetching habit data:', error);
            dispatch({
                type: 'UPDATE_HABIT',
                payload: habitData
            });
        }
    }

    

    return (
        <div className={`habit-card ${isCompleted ? 'completed' : ''}`}>
            <div className="habit-info">
                <h3 className={isCompleted ? 'strikethrough' : ''}>{habitData.title}</h3>
                <p>{habitData.description}</p>
                <p className="last-completed">Last completed: {getLastCompletedDate()}</p>
            </div>
            <div className="actions-bottom-right">
                <p className="streak-text">Streak: {habit.currentStreak}</p>
                <button onClick={handleCompleted}>
                    {isCompleted ? 'Undo Complete' : 'Mark as Complete'}
                </button>
            </div>
            <div className="dropdown">
                <button className="menu-btn">•••</button>
                <div className="dropdown-content">
                    <a onClick={enableUpdate} href="#">Edit</a>
                    <a onClick={handleDelete} href="#" className="delete-option">Delete</a>
                </div>
            </div>
            <HabitCalendar habit={habitData} />
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h3>Updating Habit</h3>
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
                <button onClick={handleUpdate}>confirm</button>
                {error && <div className="error">{error}</div>}
            </Popup>
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