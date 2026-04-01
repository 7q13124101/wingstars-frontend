import axios from "axios";
import { PAGE_NAME, HTTP_STATUS } from "../../common/constants";
import { localStorageService } from "../../common/storages";

export const logout = (redirectToLogin = true) => {
    localStorage.clear();

    if (!redirectToLogin) return;

    const currentPage = window.location.pathname;
    const loginPage = PAGE_NAME.LOGIN_PAGE;

    if (currentPage !== loginPage) {
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = PAGE_NAME.LOGIN_PAGE;
    }
}

export const sendRefreshTokenRequest = async () => {
    let response;
    try {
        const url = import.meta.env.VITE_API_URL;
        response = await axios.get(`${url}/auth/token`, { withCredentials: true });
        if(response.status === HTTP_STATUS.OK) {
            localStorageService.setAccessToken(response.data.accessToken);
            localStorageService.setAccessTokenExpiresAt(response.data.accessTokenExpiresAt);
            return;
        }
        logout(true);
        return;
    }
    catch (error) {
        logout(true);
        return;
    }
};