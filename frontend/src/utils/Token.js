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
        } else {
            localStorage.removeItem('access');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

export default createAccessToken;
