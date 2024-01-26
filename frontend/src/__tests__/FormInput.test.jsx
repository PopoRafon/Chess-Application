import '@testing-library/jest-dom';
import FormInput from '#components/forms/FormInput';
import { fireEvent, render, screen } from '@testing-library/react';

describe('form input component', () => {
    test('correctly renders form input ', () => {
        const { getByLabelText } = render(
            <FormInput
                name="username"
                label="Username"
                type="text"
                value="test username"
                handleChange={() => {}}
                error=""
                requirements={[]}
            />
        );

        expect(getByLabelText('Username')).toBeInTheDocument();
        expect(getByLabelText('Username')).toHaveValue('test username');
    });

    test('triggers handleChange function when input changes', () => {
        const handleChangeMock = jest.fn();
        const { getByLabelText } = render(
            <FormInput
                name="username"
                label="Username"
                type="text"
                value=""
                handleChange={handleChangeMock}
                error=""
                requirements={[]}
            />
        );

        fireEvent.change(getByLabelText('Username'), { target: { value: 'a' } });
        expect(handleChangeMock).toHaveBeenCalled();
    });

    test('shows requirements after input field gets focused', () => {
        const requirements = ['Needs to be longer than 8 characters.', 'Need to be shorter than 16 characters.'];
        const { queryByLabelText, queryByText } = render(
            <FormInput
                name="username"
                label="Username"
                type="text"
                value=""
                handleChange={() => {}}
                error=""
                requirements={requirements}
            />
        );

        requirements.forEach(requirement => expect(queryByText(requirement)).not.toBeInTheDocument());

        fireEvent.focus(queryByLabelText('Username'));

        requirements.forEach(requirement => expect(screen.getByText(requirement)).toBeInTheDocument());

        fireEvent.blur(queryByLabelText('Username'));

        requirements.forEach(requirement => expect(queryByText(requirement)).not.toBeInTheDocument());
    });
});
