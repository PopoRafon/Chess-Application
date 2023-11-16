import Cookies from 'js-cookie';

async function setupRankingGame(setSocket) {
    const accessToken = Cookies.get('access');
    const gameId = window.location.pathname.split('/')[3];

    return await fetch(`/api/v1/ranking/game/room/${gameId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then((data) => {
        if (data.positions) {
            setSocket(new WebSocket(`ws://${window.location.hostname}:8000/ws/ranking/game/${gameId}/`));

            return data;
        } else {
            return 'error';
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

async function setupGuestGame(setSocket) {
    const gameId = window.location.pathname.split('/')[3];

    return await fetch(`/api/v1/guest/game/room/${gameId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then((data) => {
        if (data.positions) {
            setSocket(new WebSocket(`ws://${window.location.hostname}:8000/ws/guest/game/${gameId}/`));

            data.white_username = 'Guest';
            data.black_username = 'Guest';
            data.white_avatar = '/media/avatar.png';
            data.black_avatar = '/media/avatar.png';

            return data;
        } else {
            return 'error';
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

async function setupComputerGame(setSocket, user) {
    const gameId = Cookies.get('computer_game_url');

    return await fetch(`/api/v1/computer/game/room/${gameId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then((data) => {
        if (data.positions) {
            setSocket(new WebSocket(`ws://${window.location.hostname}:8000/ws/computer/game/${gameId}/`));

            if (user.isLoggedIn) {
                data.white_username = user.username;
                data.white_avatar = user.avatar;
                data.white_rating = user.rating;
            } else {
                data.white_username = 'Guest';
                data.white_avatar = '/media/avatar.png';
            }

            data.black_username = 'Bot';
            data.black_avatar = '/media/avatar.png';
            data.player = 'w';

            return data;
        } else {
            return 'error';
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

export { setupRankingGame, setupGuestGame, setupComputerGame };
