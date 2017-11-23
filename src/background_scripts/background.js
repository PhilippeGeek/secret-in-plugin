const leftPad = require("left-pad");

const browser = chrome || window.browser;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = leftPad(message.text, message.amount, message.with);
    sendResponse(result);
});

