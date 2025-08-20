import loginService from "../services/login.js";
import {useState} from "react";
import LoginForm from "./LoginForm";
import Togglable from "./Togglable";

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
            emitSuccess(`Logged in as ${user.name}`)
            setUsername('')
            setPassword('')
        } catch (exception) {
            console.log(exception)
            emitError('Wrong username or password. Please try again.')
        }
    }

    const loginForm = () => {

        return (
            <div>
                <Togglable buttonLabel='login'>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({target}) => setUsername(target.value)}
                        handlePasswordChange={({target}) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Togglable>
            </div>
        )
    }

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