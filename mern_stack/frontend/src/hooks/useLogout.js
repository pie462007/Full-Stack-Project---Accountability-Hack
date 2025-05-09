import { useAuthContext } from './useAuthContext'
import { useContext } from 'react'

export const useLogout = () => {
    const {dispatch} = useAuthContext()

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({type: 'LOGOUT'})
    }

    return {logout}
}