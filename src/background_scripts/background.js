import secretin from '../manager/Manager';
import app from '../manager/AppUIActions';
import {Utils} from 'secretin';


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
    let api;
    const data = message.data || {};
    switch (message.type) {
        case 'user':
            if (!server) return sendResponse(null);
            if (secretin(server).currentUser && secretin(server).currentUser.hasOwnProperty("username")){
                return secretin(server).refreshUser().then(() => {
                    let user = secretin(server).currentUser;
                    return JSON.parse(JSON.stringify(user));
                }).catch((e) => {});
            } else {
                return sendResponse(null);
            }
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
            secretin(server).currentUser = {};
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
            api = secretin(server);
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
                                        let fields = secret.fields || [];
                                        for(let i = 0; i<fields.length; i++) {
                                            let label = fields[i].label;
                                            if(label === 'login') {
                                                fields[i].content = data.username;
                                            } else if(label === 'password') {
                                                fields[i].content = data.password;
                                            }
                                        }
                                        return api.currentUser.editSecret(metadata.id, secret);
                                    })
                                );
                            }
                        }
                    }
                    Promise.all(receptions)
                        .then(() => resolve({success: true}))
                        .catch(() => reject({success: false}))
                }).catch(() => {
                    reject({success: false})
                })

            });
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
                                        let fields = secret.fields || [];
                                        let username, password;
                                        for(let i = 0; i<fields.length; i++) {
                                            let label = fields[i].label;
                                            if(label === 'login') {
                                                username = fields[i].content;
                                            } else if(label === 'password') {
                                                password = fields[i].content;
                                            }
                                        }
                                        candidates.push({username, password});
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

