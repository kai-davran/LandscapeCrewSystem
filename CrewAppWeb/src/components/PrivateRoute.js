import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const token = useSelector(state => state.auth.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="c-app c-default-layout">
        <div className="c-wrapper">
            <div className="c-body">
            {children}
            </div>
        </div>
        </div>
    );
};

export default PrivateRoute;