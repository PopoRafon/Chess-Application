let tokenRefresh;

async function createAccessToken() {
    await fetch('/api/v1/token/refresh', {
        method: 'POST'
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (data.access) {
            localStorage.setItem('access', data.access);
            refreshAccessToken();
        } else {
            localStorage.removeItem('access');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function refreshAccessToken() {
    clearInterval(tokenRefresh);
    const token = localStorage.getItem('access');

    if (token) {
        tokenRefresh = setInterval(() => {
            fetch('/api/v1/token/refresh', {
                method: 'POST'
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.access) {
                    localStorage.setItem('access', data.access);
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
