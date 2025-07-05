import { Navigate, Outlet } from 'react-router-dom';
import VerifyToken from './verifyToken'; 
import { useEffect, useState } from 'react';

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
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />; //If isAuthenticated is true: The PrivateRoute renders <Outlet />
};

export default PrivateRoute;