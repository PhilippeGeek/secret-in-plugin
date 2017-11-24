

export default class PasswordForm {

    static hashCode(str = '') {
        return Math.abs(str.split('').reduce((prevHash, currVal) =>
            ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0));
    }

    /**
     *
     * @param {string} pid
     * @param {HTMLInputElement} passwordField
     */
    constructor(pid, passwordField){
        this.domain = pid;
        /**
         * @type {HTMLInputElement}
         */
        this.passwordField = passwordField;
        /**
         * @type {HTMLInputElement}
         */
        this.usernameField = this.findUsernameField();
        this.ufid = pid + '/' + this.computeFID();
        this.setupListen();
        this.proposal = false;
    }

    findUsernameField() {
        const pwf = this.passwordField;
        const elements = pwf.form.elements;
        const candidates = [];
        for (let i=0; i<elements.length; i++) {
            const element = elements[i];
            if(element instanceof HTMLInputElement){
                if(element.type === "text"
                || element.type === "email"
                || element.type === "phone") {
                    candidates.push(element);
                }
            }
        }
        if(candidates.length === 1) {
            return candidates[0]
        } else if(candidates.length === 0){
            return null; // no possible candidates
        } else {
            for(let i=0; i<candidates.length; i++) {
                if(/user/i.exec(candidates[i].name)){
                    return candidates[i];
                }
            }
            for(let i=0; i<candidates.length; i++) {
                if(/login/i.exec(candidates[i].name)){
                    return candidates[i];
                }
            }
            for(let i=0; i<candidates.length; i++) {
                if(/mail/i.exec(candidates[i].name)){
                    return candidates[i];
                }
            }
        }
    }

    /**
     * Compute a unique form ID for this page.
     * The FID is based on fields names on the page.
     */
    computeFID() {
        const form = this.passwordField.form;
        return PasswordForm.hashCode(form.method + form.action + form.id);
    }

    setupListen() {
        if(this.usernameField){

            let onEvent = (e) => {
                if(!this.proposal) {
                    console.log('Asking...');
                    browser.runtime.sendMessage({
                        type: 'form-request',
                        data: {
                            domain: this.domain
                        }
                    }).then((result) => {
                        if (result.success) {
                            let candidates = result.candidates;
                            if (candidates.length === 1) {
                                let candidate = candidates[0];
                                this.usernameField.value = candidate.username;
                                this.passwordField.value = candidate.password;
                            }
                        } else {
                            // No login for this website
                        }
                    });
                    this.proposal = true;
                }
            };
            this.usernameField.addEventListener('click', onEvent);

        }

        this.passwordField.form.addEventListener('submit', () => {
            browser.runtime.sendMessage({
                type: 'form-submit',
                data: this.serialize()
            })
        })
    }

    serialize(){
        return {
            domain: this.domain,
            ufid: this.ufid,
            username: this.usernameField.value,
            password: this.passwordField.value
        }
    }
}