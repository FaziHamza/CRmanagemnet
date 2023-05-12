export class ApiConstants {
    public static apiEndPoints = {
        auth: {
            login: 'Account/Login',
            resetPassword: 'Account/ResetPassword',
            forgot: 'Account/ForgotPassword',
            register: 'Account/register',
            confirmEmail: 'Account/ConfirmEmail',
            sendCodeAgain: 'Account/SendCodeAgain',
            sendSMSAgain: 'Account/SendSMSAgain',
            changePassword: "Account/ChangePassword"

        },
        user: {
            getList: '',
            create: '',
            update: '',
            delete: ''
        }
    };
}
