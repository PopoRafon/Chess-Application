import 'jest';
import '@testing-library/jest-dom';
import Alert from '#components/alert/Alert';
import { MemoryRouter } from 'react-router-dom';
import { AlertContext } from '#contexts/AlertContext';
import { render } from '@testing-library/react';

const renderWithAlertContext = (alertContextValue={ alert: '', setAlert: () => {} }) => {
    return render(
        <MemoryRouter>
            <AlertContext.Provider value={{ ...alertContextValue }}>
                <Alert />
            </AlertContext.Provider>
        </MemoryRouter>
    );
}

describe('alert component', () => {
    test('correctly renders alert', () => {
        const alertText = 'You have been successfully logged in!';
        const { getByText } = renderWithAlertContext({ alert: alertText });

        expect(getByText(alertText).textContent).toBe(alertText);
    });

    test('triggers setAlert function after 3.5 seconds', () => {
        const alertText = 'You have been successfully logged in!';
        const setAlertMock = jest.fn();

        jest.useFakeTimers();
        renderWithAlertContext({ alert: alertText, setAlert: setAlertMock });
        jest.runAllTimers();

        expect(setAlertMock).toBeCalled();
    });
});
