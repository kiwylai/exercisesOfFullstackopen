const Notification = ({errorMessage, successMessage}) => {
    if (errorMessage === null && successMessage === null) {
        return null;
    }

    if (successMessage !== null) {
        return <div className="message success">{successMessage}</div>;
    }

    if (errorMessage !== null) {
        return <div className="message error">{errorMessage}</div>;
    }
};

export default Notification