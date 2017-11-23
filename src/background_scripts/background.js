import secretin from '../manager/Manager';
import app from '../manager/AppUIActions';
import {Utils} from 'secretin';


const browser = chrome || window.browser;

let server = localStorage.secretin_server;
let shortLogin = localStorage.shortLogin;

if (server && shortLogin) {
    secretin(server).shortLogin({shortpass: shortLogin})
        .catch((e) => {
            console.log(e);
            delete localStorage.shortLogin;
        })
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) return;
    const data = message.data || {};
    switch (message.type) {
        case 'user':
            if (!server) return sendResponse(null);
            return secretin(server).refreshUser().then(() => {
                let user = secretin(server).currentUser;
                return JSON.parse(JSON.stringify(user));
            }).catch((e) => {});
            break;
        case 'login':
            return app(secretin(data.server)).loginUser(
                data
            ).then((user) => {
                server = localStorage.secretin_server = data.server;
                if (data.shortLogin) {
                    console.log("ShortLogin !!!");
                    let shortpass = Utils.PasswordGenerator.generatePassword();
                    secretin(data.server).currentUser.activateShortLogin(shortpass, 'firefox').then(() => {
                        localStorage.shortLogin = shortpass;
                    }).catch((err) => {
                        console.log(err);
                        console.log("Nope :-(");
                    });
                }
                return {
                    success: true
                };
            }, (e) => {
                return {
                    success: false
                };
            });
        case 'logout':
            if (secretin(server).currentUser && secretin(server).currentUser.disconnect)
                secretin(server).currentUser.disconnect();
            secretin(server).currentUser = null;
            delete localStorage.shortLogin;
            sendResponse();
            break;
        case 'register':
            return app(secretin(data.server)).createUser(
                {
                    username: data.username,
                    password: data.password,
                    confirmPassword: data.passwordConfirmation
                }
            ).then(() => {
                return app(secretin(data.server)).loginUser(
                    data
                );
            }).then((user) => {
                server = localStorage.secretin_server = data.server;
                return {
                    success: true
                };
            }).catch((e) => {
                return {
                    success: false
                };
            });
            break;
        case 'form-submit':

            break;
        case 'form-request':
            let api = secretin(server);
            return new Promise((resolve, reject) => {
                if (!api.currentUser || !api.currentUser.username) {
                    return reject({success: false});
                }
                const domain = data.domain;
                const candidates = [];
                const receptions = [];
                api.refreshUser().then(() => {
                    let metadatas = api.currentUser.metadatas;
                    for (let id in metadatas) {
                        if (metadatas.hasOwnProperty(id)) {
                            const metadata = metadatas[id];
                            if (metadata.title === domain) {
                                receptions.push(
                                    api.getSecret(metadata.id).then((secret) => {
                                        candidates.push(secret);
                                        console.log(secret);
                                    })
                                );
                            }
                        }
                    }
                    Promise.all(receptions)
                        .then(() => resolve({success: true, candidates}))
                        .catch(() => reject({success: false}))
                }).catch(() => {
                    reject({success: false})
                })

            });
            break;
    }
});

