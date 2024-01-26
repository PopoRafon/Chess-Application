import '@testing-library/jest-dom';
import Navigation from '#components/core/Navigation';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '#contexts/UserContext';
import { render } from '@testing-library/react';

const renderWithUserContext = (userContextValue) => {
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
        const { getByText } = renderWithUserContext({ isLoggedIn: false });

        expect(getByText('Login')).toBeInTheDocument();
        expect(getByText('Login').href).toContain('/login');
        expect(getByText('Sign Up')).toBeInTheDocument();
        expect(getByText('Sign Up').href).toContain('/register');
    });

    test('correctly renders navigation for authenticated user', () => {
        const user = { isLoggedIn: true, username: 'Test User' };
        const { queryByText, getByText } = renderWithUserContext(user);

        expect(queryByText('Login')).not.toBeInTheDocument();
        expect(queryByText('Sign Up')).not.toBeInTheDocument();
        expect(getByText('Settings')).toBeInTheDocument();
        expect(getByText('Settings').href).toContain('/settings');
        expect(getByText(user.username)).toBeInTheDocument();
    });
});
