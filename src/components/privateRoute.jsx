import { Navigate, Outlet } from 'react-router-dom';
import VerifyToken from './verifyToken';
import { useEffect, useState } from 'react';
import LogoutButton from './logout';

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isValid = await VerifyToken();
            setIsAuthenticated(isValid);
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return
    }
    return isAuthenticated ? <div> <Outlet /> <LogoutButton /></div> : <Navigate to="/" />; //If isAuthenticated is true: The PrivateRoute renders <Outlet />
};

export default PrivateRoute;