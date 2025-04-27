import { useState, useEffect } from 'react';
import '../styles/HabitCalendar.css';

const HabitCalendar = ({ habits }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);

    useEffect(() => {
        if (habits) {
            generateCalendar();
        }
    }, [currentDate, habits]);

    const generateCalendar = () => {
        if (!habits) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Create calendar array
        const days = [];
        
        // Add empty cells for days before first of month
        for (let i = 0; i < startingDay; i++) {
            days.push({ date: null, completions: [] });
        }

        // Add days of month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const completions = habits.filter(habit => 
                (habit.completions || []).some(completion => {
                    const completionDate = new Date(completion);
                    return completionDate.getDate() === day &&
                           completionDate.getMonth() === month &&
                           completionDate.getFullYear() === year;
                })
            ).map(habit => habit.title);
            days.push({ date, completions });
        }

        setCalendarDays(days);
    };

    const changeMonth = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const getMonthName = () => {
        return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    if (!habits) return null;

    return (
        <div className="habit-calendar">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <h3>{getMonthName()}</h3>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            <div className="calendar-grid">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
                {calendarDays.map((day, index) => {
                    const tooltipContent = day.date 
                        ? (day.completions.length > 0 
                            ? `Completed Habits:\n${day.completions.map((habit, i) => `${i + 1}. ${habit}`).join('\n')}`
                            : 'No habits completed')
                        : '';
                    
                    return (
                        <div 
                            key={index} 
                            className={`calendar-day ${day.date ? '' : 'empty'} ${day.completions.length > 0 ? 'completed' : ''}`}
                            data-tooltip={day.date ? true : false}
                            data-tooltip-content={tooltipContent}
                        >
                            {day.date ? day.date.getDate() : ''}
                            {day.completions.length > 0 && (
                                <div className="completion-dot"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitCalendar; 