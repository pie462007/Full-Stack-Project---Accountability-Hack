import React from 'react'
import '../styles/UserBoardProfile.css'

const UserBoardProfile = ({ userHabitData, frequency }) => {
    const getStreakText = (streak) => {
        switch(frequency) {
            case 'daily':
                return `${streak} days`;
            case 'weekly':
                return `${streak} weeks`;
            case 'monthly':
                return `${streak} months`;
            default:
                return streak;
        }
    }

    return (
        <div className="profile">
            <div className="leaderboard-header">
                <div className="rank">Rank</div>
                <div className="user">Email</div>
                <div className="habit">Habit</div>
                <div className="streak">Current Streak</div>
            </div>

            {userHabitData && userHabitData.length > 0 ? (
                userHabitData.map((habit, index) => {
                    console.log('Rendering habit:', {
                        title: habit.title,
                        user: habit.user_id,
                        email: habit.user_id?.email
                    });
                    return (
                        <div key={habit._id} className="flex">
                            <div className="rank">{index + 1}</div>
                            <div className="user">
                                {habit.user_id?.email || 'No email available'}
                            </div>
                            <div className="habit">{habit.title}</div>
                            <div className="streak">{getStreakText(habit.currentStreak || 0)}</div>
                        </div>
                    );
                })
            ) : (
                <div className="no-data">
                    No {frequency} habits available yet. Be the first to create one!
                </div>
            )}
        </div>
    )
}

export default UserBoardProfile