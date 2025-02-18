import React, { createContext, useState, useEffect } from 'react'
import { handleApiError } from '../../middleware/errorHandler';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const LoginContext = createContext("");

export const Context = ({children}) => {
    const [loginData, setLoginData] = useState(null);
    const [loading, setLoading] = useState(true);

    const validateToken = async () => {
        try {
            const token = localStorage.getItem("usertoken");
            
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token validation failed');
            }

            const data = await response.json();

            if (data.valid) {
                setLoginData(data.user);
            } else {
                localStorage.removeItem("usertoken");
                setLoginData(null);
            }
        } catch (error) {
            handleApiError(error);
            localStorage.removeItem("usertoken");
            setLoginData(null);
            toast.error('Authentication failed. Please login again.');
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                return data.token;
            }
            return null;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    };

    useEffect(() => {
        validateToken();
    }, []);

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <LoginContext.Provider value={{loginData, setLoginData}}>
            {children}
        </LoginContext.Provider>
    )
}

export default Context;
