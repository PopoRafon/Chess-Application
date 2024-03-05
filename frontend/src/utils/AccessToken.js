import Cookie from 'js-cookie';

/**
 * Class for fetching access tokens from api and storing them in cookies.
 */
export default class AccessToken {
    static #tokenRefreshInterval;

    /**
     * Fetches access token from api.
     * If fetch succeeds then stores received token in cookies and calls `refreshToken` method.
     * @returns {Promise<void>}
     */
    static async createToken() {
        return await fetch('/api/v1/token/refresh', {
            method: 'POST'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.access) {
                Cookie.set('access', data.access);
                this.refreshToken();
            } else {
                Cookie.remove('access');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    /**
     * Fetches access token from api at certain intervals (default time is 14 minutes).
     * If fetch succeeds then stores received token in cookies.
     * @returns {Promise<void>}
     */
    static refreshToken() {
        clearInterval(this.#tokenRefreshInterval);
        const token = Cookie.get('access');
    
        if (token) {
            this.#tokenRefreshInterval = setInterval(() => {
                fetch('/api/v1/token/refresh', {
                    method: 'POST'
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access) {
                        Cookie.set('access', data.access);
                    } else {
                        clearInterval(this.#tokenRefreshInterval);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }, 14 * 60 * 1e3);
        }
    }
}
