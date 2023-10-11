export default async function getUserData(setUser) {
    const token = localStorage.getItem('access');

    if (token) {
        await fetch('/api/v1/user/data', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setUser({
                    ...data.success,
                    isLoggedIn: true
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
