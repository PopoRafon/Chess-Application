import Cookie from 'js-cookie';

let tokenRefreshInterval;

async function createAccessToken() {
    return await fetch('/api/v1/token/refresh', {
        method: 'POST'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.access) {
            Cookie.set('access', data.access);
            refreshAccessToken();
        } else {
            Cookie.remove('access');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function refreshAccessToken() {
    clearInterval(tokenRefreshInterval);
    const token = Cookie.get('access');

    if (token) {
        tokenRefreshInterval = setInterval(() => {
            fetch('/api/v1/token/refresh', {
                method: 'POST'
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.access) {
                    Cookie.set('access', data.access);
                } else {
                    clearInterval(tokenRefreshInterval);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }, 9*60*1000);
    }
}

export { createAccessToken, refreshAccessToken };
