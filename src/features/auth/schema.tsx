import yup from 'yup';
import { REGEX, FORM_VALIDATION } from '../../common/constants';

const emailSchema = yup.string().required().matches(REGEX.EMAIL);
const passwordSchema = yup.string().required().min(FORM_VALIDATION.passwordMinLength).max(FORM_VALIDATION.textMaxLength);

export const loginWithPasswordScheme = yup.object({
    email: emailSchema,
    password: passwordSchema.matches(REGEX.PASSWORD),
});

export const createPasswordSchema = yup.object({
    password: passwordSchema.matches(REGEX.PASSWORD, {
        message: 'auth.verifyRegistration.validation.passwordNotMatch',
    }),
    confirmPassword: yup.string().required().oneOf([yup.ref('password')], 'auth.verifyRegistration.validation.passwordNotMatch'),
    code: yup.string().required(),
    email: emailSchema,
})

export const changePasswordSchema = yup.object({
    oldPassword: passwordSchema.matches(REGEX.PASSWORD, {
        message: 'auth.verifyRegistration.validation.passwordNotMatch',
    }),
    password: passwordSchema.matches(REGEX.PASSWORD, {
        message: 'auth.verifyRegistration.validation.passwordNotMatch',
    }),
    confirmNewPassword: yup.string().required().oneOf([yup.ref('password')], 'auth.verifyRegistration.validation.passwordNotMatch'),
})

export const forgotPasswordSchema = yup.object({
    email: emailSchema,
}) 