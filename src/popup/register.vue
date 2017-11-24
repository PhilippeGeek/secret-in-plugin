<template>
    <div id="register">
        <form v-on:submit.prevent="handleForm()">
            <div class="form-margin">

                <div class="form-group">
                    <label for="username">Identifiant</label>
                    <input type="text" class="form-control" id="username" name="username" placeholder=""
                           v-model="username">
                    <small id="noLogin" v-if="registrationMode" class="form-text text-muted">Je ai déjà un compte,
                        <a class="text-info link" v-on:click="registrationMode = false">se connecter</a>
                    </small>
                    <small id="goRegister" v-if="!registrationMode" class="form-text text-muted">Je n'ai pas de compte,
                        <a class="text-info link" v-on:click="registrationMode = true">en créer un</a>
                    </small>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" class="form-control" id="password" name="password" placeholder=""
                           v-model="password">
                    <small id="error" v-if="error" class="form-text text-danger">Identifiant ou mot de passe faux</small>
                </div>
                <div class="form-group" v-if="registrationMode">
                    <label for="passwordConfirmation">Confirmation du mot de passe</label>
                    <input type="password" class="form-control" id="passwordConfirmation" name="passwordConfirmation"
                           placeholder="" v-model="passwordConfirmation">
                </div>
                <div class="form-group">
                    <label for="server">Serveur de données</label>
                    <input type="url" class="form-control" id="server" name="server" placeholder=""
                           value="http://localhost:3000" v-model="server">
                    <small id="dataServerHelp" class="form-text text-muted">
                        Ce serveur conserve les données chiffrées de vos mots de passes
                    </small>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" v-model="stayLogged">
                        Rester connecté
                    </label>
                </div>
            </div>
            <button class="btn btn-block btn-primary btn-not-round">Connexion</button>
        </form>
    </div>
</template>

<script>
    const browser = chrome || window.browser;
    export default {
        data() {
            return {
                stayLogged: true,
                error: false,
                registrationMode: false,
                username: "",
                password: "",
                passwordConfirmation: "",
                server: "http://localhost:3000"
            }
        },

        beforeRouteEnter(to, from, next) {
            browser.runtime.sendMessage({
                type: 'user'
            }).then((user) => {
                if (!user) next();
                else next('/storage');
            })
        },
        // quand la route change et que ce composant est déjà rendu,
        // la logique est un peu différente
        beforeRouteUpdate(to, from, next) {
            browser.runtime.sendMessage({
                type: 'user'
            }).then((user) => {
                if (!user) next();
                else next('/storage');
            })
        },
        methods: {
            register() {
                browser.runtime.sendMessage({
                    type: 'register',
                    data: {
                        username: this.username,
                        password: this.password,
                        passwordConfirmation: this.passwordConfirmation,
                        server: this.server
                    }
                }).then(() => {
                    this.$router.push('/storage')
                })
            },
            login() {
                browser.runtime.sendMessage({
                    type: 'login',
                    data: {
                        username: this.username,
                        password: this.password,
                        shortLogin: this.stayLogged,
                        server: this.server
                    }
                }).then((result) => {
                    if (result.success)
                        this.$router.push('/storage');
                    else
                        this.error = true;
                })
            },
            handleForm() {
                if (this.registrationMode)
                    this.register();
                else
                    this.login();
            }
        }
    }
</script>

<style lang="scss">
    #register {
        background: #f9f9f9;
        width: 300px;

        .link {
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }

    }
</style>