import React, { useState, useEffect } from 'react'
import UserBoardProfile from '../components/UserBoardProfile'
import { useAuthContext } from '../hooks/useAuthContext'

const Leaderboard = () => {
    const [habitData, setHabitData] = useState([])
    const [type, setType] = useState('daily')
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for frequency:', type);
                const url = `/api/habits/leaderboard?frequency=${type}`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const data = await response.json()
                
                if (response.ok) {
                    console.log('Received habit data:', data.map(h => ({
                        title: h.title,
                        email: h.user_id?.email,
                        streak: h.currentStreak
                    })));
                    
                    // Sort by currentStreak in descending order and take top 10
                    const sortedData = data
                        .sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))
                        .slice(0, 10);
                    setHabitData(sortedData);
                } else {
                    console.error('Error fetching leaderboard data:', data.error)
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error)
            }
        }

        if (user) {
            fetchData()
        }
    }, [user, type])

    const handleClick = (e) => {
        const newType = e.target.dataset.id;
        console.log('Changing frequency to:', newType);
        setType(newType)
    }

    const getFrequencyTitle = (type) => {
        switch(type) {
            case 'daily':
                return 'Daily Habits';
            case 'weekly':
                return 'Weekly Habits';
            case 'monthly':
                return 'Monthly Habits';
            default:
                return 'Habits';
        }
    }

    return (
        <div className="board">
            <h1 className="leaderboard">Top 10 {getFrequencyTitle(type)} Leaderboard</h1>

            <div className="habitFrequency">
                <button 
                    onClick={handleClick} 
                    data-id="daily"
                    className={type === 'daily' ? 'active' : ''}
                >
                    Daily
                </button>
                <button 
                    onClick={handleClick} 
                    data-id="weekly"
                    className={type === 'weekly' ? 'active' : ''}
                >
                    Weekly
                </button>
                <button 
                    onClick={handleClick} 
                    data-id="monthly"
                    className={type === 'monthly' ? 'active' : ''}
                >
                    Monthly
                </button>
            </div>

            <UserBoardProfile userHabitData={habitData} frequency={type} />
        </div>
    )
}

export default Leaderboard