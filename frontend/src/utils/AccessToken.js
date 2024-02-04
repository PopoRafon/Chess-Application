import Cookie from 'js-cookie';

export default class AccessToken {
    static #tokenRefreshInterval;

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
