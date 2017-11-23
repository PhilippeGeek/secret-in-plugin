import PasswordForm from './manager/PasswordForm';

const seenForms = new Set();
const forms = [];

const parser = function() {
    let passwordFields = document.querySelectorAll("input[type='password']");
    for (let i = 0; i < passwordFields.length; i++) {
        if (seenForms.has(passwordFields[i])) continue;
        seenForms.add(passwordFields[i]);
        forms.push(new PasswordForm(window.location.hostname, passwordFields[i]));
    }
    console.log(forms);
};
parser();
setInterval(parser, 3000);