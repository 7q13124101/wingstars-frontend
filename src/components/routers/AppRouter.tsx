import { Navigate, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { localStorageService } from "../../common/storages";
import LoadingPage from "../pages/LoadingPage";

const LoginPage = lazy(() => import('../pages/login-page/LoginPage'));


interface ProtectedRouteProps {
    children: JSX.Element;
    isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
}

const AppRouter: React.FC = () => {
    const isAuthenticated = Boolean(localStorageService.getAccessToken());
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                {/* <Route path="/admin" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <AdminPage />
                    </ProtectedRoute>
                } /> */}
                {/* Add more routes here */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* 404 fallback */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
        </Suspense>
    )
}

export default AppRouter;
