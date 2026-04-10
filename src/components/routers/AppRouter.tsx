import { Navigate, Route, Routes } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { localStorageService } from '../../common/storages';
import LoadingPage from '../pages/LoadingPage';
import { UserProvider } from '../../context/UserContext';
import MediaLibrary from "../pages/media-library/MediaLibrary";
import AdminLayout from '../../layouts/AdminLayout';
import NewsPage from '../pages/news-page/NewsPage';
import MemberPage from '../pages/member-page/MemberPage';

const LoginPage = lazy(() => import('../pages/login-page/LoginPage'));
const UsersPage = lazy(() => import('../pages/user-page/UsersPage'));
const BannerPage = lazy(() => import('../pages/banner-page/BannerPage'));
const AdminPage = lazy(() => import('../pages/admin-page/AdminPage'));

interface ProtectedRouteProps {
    children: JSX.Element;
    isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRouter: React.FC = () => {
    const isAuthenticated = Boolean(localStorageService.getAccessToken());
    // const isAuthenticated = true;

    return (
        <UserProvider>
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<UsersPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="banners" element={<BannerPage />} />
                        <Route path="admins" element={<AdminPage />} />
                        <Route path="media-library" element={<MediaLibrary />} />
                        <Route path="news" element={<NewsPage />} />
                        <Route path="members" element={<MemberPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </UserProvider>
    );
};

export default AppRouter;
