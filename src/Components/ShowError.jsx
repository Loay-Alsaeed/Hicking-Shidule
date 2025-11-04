import React from 'react';
import { useError } from '../Context/ErrorContext';

const ShowError = () => {
    const { errors, removeError } = useError();

    if (!errors || errors.length === 0) return null;

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-[360px] max-w-[90vw]">
                {errors.map(({ id, message }) => (
                    <div
                        key={id}
                        role="alert"
                        aria-live="assertive"
                        className="bg-red-500 text-white rounded-2xl shadow-lg overflow-hidden animate-[fadeIn_.2s_ease-out]"
                    >
                        <div className="flex items-start gap-3 p-4">
                            <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded bg-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.75 5.25a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-1.5 0v-6zm.75 10.5a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold">Error!</p>
                                <p className="text-sm leading-5 mt-1">{message}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => removeError(id)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ShowError;


