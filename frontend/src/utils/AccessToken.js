async function createAccessToken() {
    await fetch('api/v1/token/refresh', {
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
    const tokenRefresh = setInterval(() => {
        fetch('api/v1/token/refresh', {
            method: 'POST'
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.access) {
                console.log('dziala');
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

export { createAccessToken, refreshAccessToken };
