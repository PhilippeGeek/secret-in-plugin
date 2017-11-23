import PasswordForm from './manager/PasswordForm';

let passwordFields = document.querySelectorAll("input[type='password']");
const forms = [];
for(var i=0; i<passwordFields.length;i++){
    forms.push(new PasswordForm(window.location.hostname, passwordFields[i]));
}
console.log(forms);