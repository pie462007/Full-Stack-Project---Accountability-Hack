import {useState} from 'react'
import { useSignup } from '../hooks/useSignup'
import '../index.css';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
        console.log(email, password)
    }

    return (
        <form className = "signup" onSubmit = {handleSubmit}>
            <h3>Sign up</h3>

            <label>Email:</label>
            <input
                type = "email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value = {email}
            />
            <label>Password:</label>
            <input
                type = "password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value = {password}
            />

            <button type="submit" disabled ={isLoading}> submit</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default Signup