import 'jest';
import nock from 'nock';
import Cookies from 'js-cookie';
import AccessToken from '#utils/AccessToken';

describe('access token util', () => {
    test('createToken method sets access cookie after successful request', async () => {
        nock(/(.*?)/)
        .post('/api/v1/token/refresh')
        .once()
        .reply(200, {
            access: 'access token'
        });

        await AccessToken.createToken();

        expect(Cookies.get('access')).toBe('access token');
    });

    test('createToken method removes access cookie after fail request', async() => {
        nock(/(.*?)/)
        .post('/api/v1/token/refresh')
        .once()
        .reply(200, {
            error: ''
        });

        Cookies.set('access', 'access token');

        await AccessToken.createToken();

        expect(Cookies.get('access')).toBeUndefined();
    });
});
