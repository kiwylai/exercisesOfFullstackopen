import {useState} from "react";
import Footer from "./components/Footer";
import Phonebook from "./components/Phonebook";
import Notes from "./components/Notes.jsx";
import Notification from "./components/Notification.jsx";
import Authentication from "./components/Authentication.jsx";
import Blogs from "./components/Blogs.jsx";

const createEmitMessage = (setMessage) => (message) => {
    setMessage(
        message
    );
    setTimeout(() => {
        setMessage(null);
    }, 5000);
}

const App = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const emitError = createEmitMessage(setErrorMessage);
    const emitSuccess = createEmitMessage(setSuccessMessage);

    return (
        <div>
            <Notification errorMessage={errorMessage} successMessage={successMessage} />
            <Authentication emitError={emitError} emitSuccess={emitSuccess}/>
            <Notes emitError={emitError} emitSuccess={emitSuccess}/>
            <Blogs emitError={emitError} emitSuccess={emitSuccess}/>
            <Phonebook/>
            <Footer/>
        </div>
    );
};

export default App;
