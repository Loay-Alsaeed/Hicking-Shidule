import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ErrorContext = createContext({
    notifyError: (_message) => {},
});

export const ErrorProvider = ({ children }) => {
    const [errors, setErrors] = useState([]);
    const idCounterRef = useRef(0);

    const removeError = useCallback((id) => {
        setErrors((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const notifyError = useCallback((message, durationMs = 3000) => {
        if (!message) return
        const id = ++idCounterRef.current;
        setErrors((prev) => [...prev, { id, message }]);
        window.setTimeout(() => removeError(id), durationMs);
    }, [removeError]);

    const value = {
        notifyError,
        errors,
        removeError,
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const ctx = useContext(ErrorContext);
    if (!ctx) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return ctx;
};


