import { HabitsContext } from '../context/HabitContext'
import { useContext } from 'react'

export const useHabitsContext = () => {
    const context = useContext(HabitsContext)

    if (!context) {
        throw Error('useHabitsContext must be used inside a HabitsContextProvider')
    }

    return context
}