<template>
    <div id="login">
        <form>
            <div class="form-margin">
                <div class="form-group">
                    <label for="username">Identifiant</label>
                    <input type="email" class="form-control" id="username" placeholder="" v-model="username">
                    <small id="noLogin" class="form-text text-muted">Je n'ai pas de compte,
                        <router-link to="/register">en créer un</router-link>
                    </small>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" class="form-control" id="password" placeholder="" v-model="password">
                </div>
                <div class="form-group">
                    <label for="server">Serveur de données</label>
                    <input type="url" class="form-control" id="server" name="server" placeholder="" v-model="server">
                    <small id="dataServerHelp" class="form-text text-muted">
                        Ce serveur conserve les données chiffrées de vos mots de passes
                    </small>
                </div>
            </div>
            <button class="btn btn-block btn-primary btn-not-round">Connexion</button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: "",
                server: "http://localhost:3000"
            }
        }
    }
</script>

<style lang="scss">
    #login {
        background: #f9f9f9;
        width: 300px;

    }
</style>