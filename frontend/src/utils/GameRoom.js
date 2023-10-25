import Cookies from 'js-cookie';

async function setupUserGame(socket, navigate) {
    const accessToken = Cookies.get('access');
    const gameId = window.location.pathname.split('/')[3];

    return await fetch(`/api/v1/user/game/room/${gameId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.game_state) {
            socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/user/game/${gameId}/`);

            return data;
        } else {
            navigate('/');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

async function setupGuestGame(socket, navigate) {
    const gameId = window.location.pathname.split('/')[3];

    return await fetch(`/api/v1/guest/game/room/${gameId}`, {
        method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.game_state) {
            socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/guest/game/${gameId}/`);

            data.white_username = 'Guest';
            data.black_username = 'Guest';

            return data;
        } else {
            navigate('/');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

async function setupComputerGame(socket, navigate, user) {
    const gameId = Cookies.get('computer_game_url');

    return await fetch(`/api/v1/computer/game/room/${gameId}`, {
        method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.game_state) {
            socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/computer/game/${gameId}/`);

            data.white_username = user.isLoggedIn ? user.username : 'Guest';
            data.black_username = 'Bot';

            return data;
        } else {
            navigate('/');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

export { setupUserGame, setupGuestGame, setupComputerGame };
