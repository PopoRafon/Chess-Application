const emailReq = ['This field must be valid email address.', 'This field must be longer than 8 characters.', 'This field cannot be longer than 64 characters.'];
const usernameReq = ['This field must be longer than 8 characters.', 'This field cannot be longer than 16 characters.'];
const passwordReq = ['This field must be longer than 8 characters.'];
const confirmPasswordReq = ['This field and password field must match.', 'This field must be longer than 8 characters.'];
const oldPasswordReq = ['This field must contain your current password.'];
const emailRecoveryReq = ['This field must contain email to your account.'];

export { emailReq, usernameReq, passwordReq, confirmPasswordReq, oldPasswordReq, emailRecoveryReq };
