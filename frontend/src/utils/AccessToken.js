import Cookie from 'js-cookie';

let tokenRefresh;

async function createAccessToken() {
    await fetch('/api/v1/token/refresh', {
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
    clearInterval(tokenRefresh);
    const token = Cookie.get('access');

    if (token) {
        tokenRefresh = setInterval(() => {
            fetch('/api/v1/token/refresh', {
                method: 'POST'
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.access) {
                    Cookie.set('access', data.access);
                } else {
                    clearInterval(tokenRefresh);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }, 9*60*1000);
    }
}

export { createAccessToken, refreshAccessToken };
