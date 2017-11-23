

export default class PasswordForm {

    /**
     *
     * @param {string} pid
     * @param {HTMLInputElement} passwordField
     */
    constructor(pid, passwordField){
        this.passwordField = passwordField;
        this.usernameField = this.findUsernameField();
        console.log(this.usernameField);
        this.ufid = pid + this.computeFID();
    }

    findUsernameField() {
        const pwf = this.passwordField;
        const elements = pwf.form.elements;
        const candidates = [];
        for (let i=0; i<elements.length; i++) {
            const element = elements[i];
            if(element instanceof HTMLInputElement){
                if(element.type === "text") {
                    candidates.push(element);
                }
            }
        }
        if(candidates.length === 1) {
            return candidates[0]
        } else if(candidates.length === 0){
            return null; // no possible candidates
        } else {
            // We have to choose
        }
    }

    /**
     * Compute a unique form ID for this page.
     * The FID is based on fields names on the page.
     */
    computeFID() {

    }
}