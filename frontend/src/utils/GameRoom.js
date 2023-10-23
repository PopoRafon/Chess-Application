import Cookie from 'js-cookie';

function setupUserGame(gameId, socket, navigate, setIsSocketLoaded) {
    const accessToken = Cookie.get('access');
    
    fetch(`/api/v1/user/game/room/${gameId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.game_state) {
            socket.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/game/${gameId}/`);
            setIsSocketLoaded(true);
        } else {
            navigate('/');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

function setupGuestGame(gameId, socket, navigate, setIsSocketLoaded) {
    fetch(`/api/v1/guest/game/room/${gameId}`, {
        method: 'GET'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.game_state) {
            socket.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/game/${gameId}/`);
            setIsSocketLoaded(true);
        } else {
            navigate('/');
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

export { setupUserGame, setupGuestGame };
