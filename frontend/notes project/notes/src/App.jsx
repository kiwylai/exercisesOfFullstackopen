import {useState} from "react";
import Footer from "./components/Footer";
import Phonebook from "./components/Phonebook";
import loginService from "./services/login";
import Notes from "./components/Notes.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const emitError = (message) => {
        setErrorMessage(
            message
        );
        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    }

    const emitSuccess = (message) => {
        setSuccessMessage(
            message
        );
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000);
    }

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
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
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
        emitSuccess('logged out')
    }

    const loginUser = loginService.getUser()

    return (
        <div>
            <Notification errorMessage={errorMessage} successMessage={successMessage} />
            {loginUser ?
                <div>
                    <p>{loginUser.name} logged-in</p>
                    <button onClick={handleLogout}>logout</button>
                </div>
                : loginForm()
            }
            <Notes emitError={emitError}/>
            <Footer/>
            <Phonebook/>
        </div>
    );
};

export default App;
