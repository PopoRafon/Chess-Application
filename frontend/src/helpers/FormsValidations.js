function registerFormValidation(formData, setErrors) {
    const { email, username, password1, password2, checkbox } = formData;
    const newErrors = {};

    if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) newErrors['email'] = 'Enter a valid email address.';

    if (email.length < 8) newErrors['email'] = 'Ensure this field has at least 8 characters.';

    if (email.length > 64) newErrors['email'] = 'Ensure this field has no more than 64 characters.';

    if (username.length < 8) newErrors['username'] = 'Ensure this field has at least 8 characters.';

    if (username.length > 16) newErrors['username'] = 'Ensure this field has no more than 16 characters.';

    if (!username.match(/^[a-zA-Z0-9]*$/)) newErrors['username'] = 'Ensure this field contains only letters and numbers.';

    if (password1.length < 8) newErrors['password1'] = 'Ensure this field has at least 8 characters.';

    if (password1 !== password2) newErrors['password2'] = 'Passwords must be the same.';

    if (password2.length < 8) newErrors['password2'] = 'Ensure this field has at least 8 characters.';

    if (!checkbox) newErrors['checkbox'] = 'Terms of Service must be accepted.';

    if (Object.keys(newErrors).length >= 1) {
        setErrors(newErrors);
        return false;
    }

    return true;
}

function loginFormValidation(formData, setErrors) {
    const { username, password } = formData;
    const newErrors = {};

    if (username.length < 8) newErrors['username'] = 'Ensure this field has at least 8 characters.';

    if (username.length > 16) newErrors['username'] = 'Ensure this field has no more than 16 characters.';

    if (!username.match(/^[a-zA-Z0-9]*$/)) newErrors['username'] = 'Ensure this field contains only letters and numbers.';

    if (password.length < 8) newErrors['password'] = 'Ensure this field has at least 8 characters.';

    if (Object.keys(newErrors).length >= 1) {
        setErrors(newErrors);
        return false;
    }

    return true;
}

function passwordResetConfirmFormValidation(formData, setErrors) {
    const { new_password1, new_password2 } = formData;
    const newErrors = {};

    if (new_password1.length < 8) newErrors['new_password1'] = 'Ensure this field has at least 8 characters.';

    if (new_password1 !== new_password2) newErrors['new_password2'] = 'Passwords must be the same.';

    if (new_password2.length < 8) newErrors['new_password2'] = 'Ensure this field has at least 8 characters.';

    if (Object.keys(newErrors).length >= 1) {
        setErrors(newErrors);
        return false;
    }

    return true;
}

function passwordResetFormValidation(formData, setErrors) {
    const { email } = formData;
    const newErrors = {};

    if (!email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)) newErrors['email'] = 'Enter a valid email address.';

    if (Object.keys(newErrors).length >= 1) {
        setErrors(newErrors);
        return false;
    }

    return true;
}

function passwordChangeFormValidation(formData, setErrors) {
    const { old_password, new_password1, new_password2 } = formData;
    const newErrors = {};

    if (old_password.length < 8) newErrors['old_password'] = 'Ensure this field contains correct old password.';

    if (new_password1.length < 8) newErrors['new_password1'] = 'Ensure this field has at least 8 characters.';

    if (new_password1 !== new_password2) newErrors['new_password2'] = 'Passwords must be the same.';

    if (new_password2.length < 8) newErrors['new_password2'] = 'Ensure this field has at least 8 characters.';

    if (Object.keys(newErrors).length >= 1) {
        setErrors(newErrors);
        return false;
    }

    return true;
}

export { registerFormValidation, loginFormValidation, passwordResetFormValidation, passwordResetConfirmFormValidation, passwordChangeFormValidation };
