import '@testing-library/jest-dom';
import Navigation from '#components/navigation/Navigation';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '#contexts/UserContext';
import { render } from '@testing-library/react';

const renderWithUserContext = (userContextValue={ isLoggedIn: false }) => {
    return render(
        <MemoryRouter>
            <UserContext.Provider value={{ user: userContextValue }}>
                <Navigation />
            </UserContext.Provider>
        </MemoryRouter>
    );
}

describe('navigation component', () => {
    test('correctly renders navigation for unauthenticated user', () => {
        const { getByText } = renderWithUserContext();

        expect(getByText('Login')).toBeInTheDocument();
        expect(getByText('Login').href).toMatch(/^http(s)?:\/\/[a-zA-Z0-9]+\/login$/);
        expect(getByText('Sign Up')).toBeInTheDocument();
        expect(getByText('Sign Up').href).toMatch(/^http(s)?:\/\/[a-zA-Z0-9]+\/register$/);
    });

    test('correctly renders navigation for authenticated user', () => {
        const user = { isLoggedIn: true, username: 'Test User' };
        const { queryByText, getByText } = renderWithUserContext(user);

        expect(queryByText('Login')).not.toBeInTheDocument();
        expect(queryByText('Sign Up')).not.toBeInTheDocument();
        expect(getByText('Settings')).toBeInTheDocument();
        expect(getByText('Settings').href).toMatch(/^http(s)?:\/\/[a-zA-Z0-9]+\/settings$/);
        expect(getByText(user.username)).toBeInTheDocument();
    });
});
