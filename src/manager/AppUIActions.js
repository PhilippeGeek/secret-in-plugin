import {Statuses, Errors} from './Manager';

const {
    DecryptMetadataStatus,
    EndDecryptMetadataStatus,
    DecryptUserOptionsStatus,
    DecryptMetadataCacheStatus,
} = Statuses;

const {
    UsernameAlreadyExistsError,
    UserNotFoundError,
    InvalidPasswordError,
    NeedTOTPTokenError,
} = Errors;

class AppUIActions {
    constructor(api) {
        this.api = api;
    }

    disconnectUser() {
        return dispatch => {
            dispatch();
            this.api.currentUser.disconnect();
        };
    }

    createUser({username, password, confirmPassword}) {
        return new Promise((resolve, reject) => {
            if (password !== confirmPassword) {
                reject({
                    error: {confirmPassword: 'Passwords mismatch'},
                });
            } else {
                this.api
                    .newUser(username, password)
                    .then(resolve)
                    .catch(error => {
                        if (error instanceof UsernameAlreadyExistsError) {
                            return reject({
                                error: {username: 'User already exists'},
                            });
                        }
                        throw error;
                    });
            }
        });
    }

    loginUser({username, password}) {
        return new Promise((resolve, reject) => {

            this.api
                .loginUser(username, password)
                .then(currentUser =>
                    resolve({
                        currentUser,
                        options: {
                            ...currentUser.options,
                            totp: currentUser.totp,
                            shortLogin: this.api.canITryShortLogin(),
                        },
                        metadata: currentUser.metadatas,
                    })
                )
                .catch(error => {
                    if (error instanceof UserNotFoundError) {
                        return reject({
                            error: {username: 'User not found'},
                        });
                    } else if (error instanceof InvalidPasswordError) {
                        if (token) {
                            return reject({
                                error: {
                                    totp: 'Token',
                                    password: 'Invalid password',
                                    token: 'or invalid token',
                                },
                            });
                        }
                        return reject({
                            error: {password: 'Invalid password'},
                        });
                    } else if (error instanceof NeedTOTPTokenError) {
                        return reject({
                            error: {totp: 'Token'},
                        });
                    }
                    throw error;
                });
        });

    }

    shortLogin({shortpass}) {
        return dispatch => {
            dispatch();
            this.api
                .shortLogin(shortpass, this.loginUserProgress, false)
                .then(currentUser => {
                    this.loginUserSuccess({
                        currentUser,
                        options: {
                            ...currentUser.options,
                            totp: currentUser.totp,
                            shortLogin: this.api.canITryShortLogin(),
                        },
                        metadata: currentUser.metadatas,
                    });
                })
                .catch(() =>
                    this.loginUserFailure({
                        error: {shortlogin: 'Invalid shortpass'},
                    })
                );
        };
    }

    disableShortLogin() {
        return dispatch => {
            dispatch();
            this.api.deactivateShortLogin();
        };
    }
}

export default (secretinApi) => {
    return new AppUIActions(secretinApi);
};