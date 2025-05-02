import React, {useState, useEffect} from 'react'
import UserBoardProfile from '../components/UserBoardProfile'
import { useAuthContext } from '../hooks/useAuthContext'

const Leaderboard = ({allHabits, allUsers}) => {
    const [habitData, setHabitData] = useState([])
    const [type, setType] = useState('daily')
    //const { user } = useAuthContext()

    /*useEffect(() => {
        const getAllHabits = async () => {
            const habits = await fetch(`/api/habits/`)
    
            const json = await habits.json()
            if(json.ok){
                for(let i = 0; i < json.length; i++){
                    const element = json[i]
                    if(element.frequency===type){
                        const user = await fetch(`/api/user/${element.user_id}`)
                        const response = await user.json()
                        if(response.ok){
                            if(habitData.some(el => el.email === response.email)){
                                let updatedData = habitData.map(el => {
                                    if(el.email === element.email && el.longestCurrent < element.currentStreak){
                                        return {...el, longestCurrent: element.currentStreak}
                                    }
                                    return el;
                                });
                                setHabitData(updatedData)
                            }
                            else{
                                setHabitData([...habitData, {
                                    email: response.email,
                                    longestCurrent: element.currentStreak
                                }])
                            }
                        }
                    }
                }
                habitData.sort((a,b) => a.longestCurrent - b.longestCurrent)
            }
        }
        getAllHabits()
    });*/

    const handleClick = (e) => {
        setType(e.target.dataset.id)
        setHabitData([])
        getAllHabits()
    }

    const getAllHabits = async () => {
        const freqHabits = allHabits.filter(el => el.frequency === type)
        for(let i = 0; i < freqHabits.length; i++){
            const element = json[i]
            const user = allUsers.find(u => u.id === element.user_id)
            if(habitData.some(el => el.email === user.email)){
                let updatedData = habitData.map(el => {
                    if(el.email === element.email && el.longestCurrent < element.currentStreak){
                        return {...el, longestCurrent: element.currentStreak}
                    }
                    return el;
                 });
                setHabitData(updatedData)
             }
            else{
                setHabitData([...habitData, {
                    email: user.email,
                    longestCurrent: element.currentStreak
                }])
            }
        }
        habitData.sort((a,b) => a.longestCurrent - b.longestCurrent)
    }

    return(
        <div className="board">
            <h1 className="leaderboard">Leaderboard</h1>

            <div className="habitFrequency">
                <button onClick={handleClick} frequency='daily'>Daily</button>
                <button onClick={handleClick} frequency='weekly'>Weekly</button>
                <button onClick={handleClick} frequency='monthly'>Monthly</button>
            </div>

            <UserBoardProfile userHabitData={habitData}></UserBoardProfile>
        </div>
    )
}

export default Leaderboard;