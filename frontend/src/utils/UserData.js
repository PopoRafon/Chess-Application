import Cookie from 'js-cookie';

/**
 * Fetches user data from server and sets user state with it.
 * @param {React.Dispatch<React.SetStateAction<user>>} setUser
 * @returns {Promise<void>} 
 */
export default async function getUserData(setUser) {
    const token = Cookie.get('access');

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
