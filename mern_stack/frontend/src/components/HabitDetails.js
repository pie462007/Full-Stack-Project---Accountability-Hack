const HabitDetails = ({ habit }) => {
    return (
        <div className="habit-details">
            <h4>{habit.title}</h4>
            <p><strong>Description: </strong>{habit.description}</p>
            <p>{habit.createdAt}</p>
        </div>
    )
}

export default HabitDetails