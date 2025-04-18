import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null) 
    const {dispatch} = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(true)

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})

        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
    }

    return {login, isLoading, error}
}