import Manager from '../manager/Manager';

const leftPad = require("left-pad");

const browser = chrome || window.browser;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log(sender);
});

