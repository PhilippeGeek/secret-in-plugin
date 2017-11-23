import secretin from '../manager/Manager';
import app from '../manager/AppUIActions';

const leftPad = require("left-pad");

const browser = chrome || window.browser;

let server = localStorage.secretin_server;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.type) return;
    const data = message.data || {};
    switch (message.type) {
        case 'user':
            if(!server) return sendResponse(null);
            let user = secretin(server).currentUser;
            sendResponse(user && user !== {}?user:null);
            break;
        case 'login':
            app(secretin(data.server)).loginUser(
                data
            ).then((user) => {
                server = localStorage.secretin_server = data.server;
                sendResponse(user);
            }, (e) => {

            });
            break;
        case 'logout':
            secretin(server).currentUser = null;
            sendResponse();
            break;
        case 'register':
            app(secretin(data.server)).createUser(
                {
                    username: data.username,
                    password: data.password,
                    confirmPassword: data.passwordConfirmation
                }
            ).then(() => {
                server = localStorage.secretin_server = data.server;
                sendResponse(user);
            }, (e) => {
                console.error(e);
            });

            break;
        case 'form-submit':

            break;
    }
});

