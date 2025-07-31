import loginService from "../services/login.js";
import {useState} from "react";

const Authentication = ({emitError, emitSuccess}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            )

            setUsername('')
            setPassword('')
        } catch (exception) {
            console.log(exception)
            emitError('Wrong username or password. Please try again.')
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const handleLogout = () => {
        window.localStorage.removeItem('loggedNoteappUser')
        emitSuccess('Logged out')
    }

    const loginUser = loginService.getUser()

    return (loginUser ?
        <div>
            <p>{loginUser.name} logged-in</p>
            <button onClick={handleLogout}>logout</button>
        </div>
        : loginForm()
    )
}

export default Authentication