const validateDuration = (duration, setError) => {
    if (duration <= 0) {
        setError(`La durée du congé ne peut pas etre négative ou égale à 0`);
        setTimeout(() => {
            setError((prevState) =>
                prevState, ""
            );
        },7000)
        return false;
    }
    return true;
};

export { validateDuration };