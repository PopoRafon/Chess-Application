import 'jest';
import nock from 'nock';
import { setupRankingGame, setupGuestGame, setupComputerGame } from '#utils/GameRoom';
import Cookies from 'js-cookie';

describe('game room util', () => {
    const gameId = 'testgameid';
    const gameUrl = 'testgameurl';
    const data = {
        pgn: 'test pgn',
        result: '',
        white_points: 5,
        black_points: 2
    };

    test('setupRankingGame function invokes setSocket function and returns data after successful request', async () => {
        window.history.pushState({}, '', new URL(`http://localhost/play/online/${gameId}`));

        nock(/(.*?)/)
        .get(`/api/v1/ranking/game/room/${gameId}`)
        .once()
        .reply(200, {
            ...data
        });
        const setSocketMock = jest.fn();
        const returnedData = await setupRankingGame(setSocketMock);

        expect(setSocketMock).toBeCalled();
        expect(setSocketMock).toBeCalledTimes(1);
        expect(returnedData).toStrictEqual(data);
    });

    test('setupRankingGame function returns string after request fails', async () => {
        window.history.pushState({}, '', new URL(`http://localhost/play/online/${gameId}`));

        nock(/(.*?)/)
        .get(`/api/v1/ranking/game/room/${gameId}`)
        .once()
        .reply(403, {
            error: 'You are unauthorized to view this page.'
        });
        const setSocketMock = jest.fn()
        const returnedData = await setupRankingGame(setSocketMock);

        expect(setSocketMock).not.toBeCalled();
        expect(returnedData).toBe('error');
    });

    test('setupGuestGame function invokes setSocket function and returns data after successful request', async () => {
        window.history.pushState({}, '', new URL(`http://localhost/play/online/${gameId}`));

        nock(/(.*?)/)
        .get(`/api/v1/guest/game/room/${gameId}`)
        .once()
        .reply(200, {
            ...data
        });
        const setSocketMock = jest.fn();
        const returnedData = await setupGuestGame(setSocketMock);

        expect(setSocketMock).toBeCalled();
        expect(setSocketMock).toBeCalledTimes(1);
        expect(returnedData).toMatchObject(data);
        expect(returnedData).toHaveProperty('white_username', 'Guest');
        expect(returnedData).toHaveProperty('black_username', 'Guest');
        expect(returnedData).toHaveProperty('white_avatar', '/media/avatar.png');
        expect(returnedData).toHaveProperty('black_avatar', '/media/avatar.png');
    });

    test('setupGuestGame function returns string after request fails', async () => {
        window.history.pushState({}, '', new URL(`http://localhost/play/online/${gameId}`));

        nock(/(.*?)/)
        .get(`/api/v1/guest/game/room/${gameId}`)
        .once()
        .reply(403, {
            error: 'You are unauthorized to view this page.'
        });
        const setSocketMock = jest.fn()
        const returnedData = await setupGuestGame(setSocketMock);

        expect(setSocketMock).not.toBeCalled();
        expect(returnedData).toBe('error');
    });

    test('setupComputerGame function invokes setSocket function and returns data after successful request when user is not logged in', async () => {
        const user = { isLoggedIn: false };
        Cookies.set('computer_game_url', gameUrl);

        nock(/(.*?)/)
        .get(`/api/v1/computer/game/room/${gameUrl}`)
        .once()
        .reply(200, {
            ...data
        });
        const setSocketMock = jest.fn();
        const returnedData = await setupComputerGame(setSocketMock, user);

        expect(setSocketMock).toBeCalled();
        expect(setSocketMock).toBeCalledTimes(1);
        expect(returnedData).toMatchObject(data);
        expect(returnedData).toHaveProperty('white_username', 'Guest');
        expect(returnedData).toHaveProperty('white_avatar', '/media/avatar.png');
        expect(returnedData).toHaveProperty('black_username', 'Bot');
        expect(returnedData).toHaveProperty('black_avatar', '/media/avatar.png');
        expect(returnedData).toHaveProperty('player', 'w');
    });

    test('setupComputerGame function invokes setSocket function and returns data after successful request when user is logged in', async () => {
        const user = { isLoggedIn: true, username: 'test user', avatar: 'test avatar', rating: 800 };
        Cookies.set('computer_game_url', gameUrl);

        nock(/(.*?)/)
        .get(`/api/v1/computer/game/room/${gameUrl}`)
        .once()
        .reply(200, {
            ...data
        });
        const setSocketMock = jest.fn();
        const returnedData = await setupComputerGame(setSocketMock, user);

        expect(setSocketMock).toBeCalled();
        expect(setSocketMock).toBeCalledTimes(1);
        expect(returnedData).toMatchObject(data);
        expect(returnedData).toHaveProperty('white_username', user.username);
        expect(returnedData).toHaveProperty('white_avatar', user.avatar);
        expect(returnedData).toHaveProperty('white_rating', user.rating);
    });

    test('setupComputerGame function returns string after request fails', async () => {
        const user = { isLoggedIn: false };
        Cookies.set('computer_game_url', gameUrl);

        nock(/(.*?)/)
        .get(`/api/v1/computer/game/room/${gameUrl}`)
        .once()
        .reply(403, {
            error: 'You are unauthorized to view this page.'
        });
        const setSocketMock = jest.fn()
        const returnedData = await setupComputerGame(setSocketMock, user);

        expect(setSocketMock).not.toBeCalled();
        expect(returnedData).toBe('error');
    });
});
