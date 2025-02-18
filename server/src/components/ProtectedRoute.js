import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from './ContextProvider/Context';

export const ProtectedRoute = ({ children, roles }) => {
    const { loginData } = useContext(LoginContext);

    if (!loginData) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(loginData.role)) {
        return <Navigate to="/" />;
    }

    return children;
}; 