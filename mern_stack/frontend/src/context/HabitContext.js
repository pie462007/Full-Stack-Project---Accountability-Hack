import { createContext, useReducer } from 'react'

export const HabitsContext = createContext();

export const HabitsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_HABITS' :
            return {
                habits: action.payload
            }
        case 'CREATE_HABIT':
            return {
                habits: [action.payload, ...state.habits]
            }
        case 'DELETE_HABIT':
            return {
                habits: state.habits.filter((h) => h._id !== action.payload._id)
            }
        case 'TOGGLE_COMPLETE':
            return {
                habits: state.habits.map((h) =>
                    h._id === action.payload._id
                        ? {
                            ...h,
                            completed: action.payload.completed,
                            currentStreak: action.payload.currentStreak,
                            completions: action.payload.completions,
                        }
                        : h
                    ),
                };
            
        default:
            return state
    }
}

export const HabitsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(HabitsReducer, {
        habits: null
    })
    return (
        <HabitsContext.Provider value={{...state, dispatch}}>
            { children }
        </HabitsContext.Provider>
    )
}