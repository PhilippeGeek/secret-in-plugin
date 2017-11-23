<template>
    <div id="storage">
        <div class="content text-center text-muted" v-if="loading">
            Chargement...
        </div>
        <div class="header" v-if="!loading">
            Bonjour {{user.username}}
        </div>
        <div class="content" v-if="!loading">
            <div class="website" v-for="metadata in user.metadatas">
                {{metadata.title}}
            </div>
        </div>
        <button class="btn btn-danger btn-block" v-if="!loading" v-on:click="logout()">Déconnexion</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: true,
                user: {},
            }
        },

        created() {
            // récupérer les données lorsque la vue est créée et
            // que les données sont déjà observées
            this.fetchData()
        },
        watch: {
            // appeler encore la méthode si la route change
            '$route': 'fetchData'
        },
        methods: {
            fetchData() {
                this.error = this.user = null;
                this.loading = true;
                // remplacer `getPost` par une fonction de récupération de données
                setTimeout(() => {
                    browser.runtime.sendMessage({
                        type: 'user'
                    }).then((user) => {
                        this.user = user;
                        this.loading = false;
                        if (!user.username) this.logout();
                        console.log(user.metadatas);
                    })

                }, 1000);
            },

            logout() {
                browser.runtime.sendMessage({
                    type: 'logout'
                }).then(() => {
                    this.$router.push('/register');
                })
            }
        }
    }
</script>

<style lang="scss">
    #storage {
        width: 250px;
        .content {
            padding: 0.8em;
        }
        .header {
            padding: 1.2em;
            text-align: center;
            background: #f0f0f0;
        }
        > .btn {
            border-radius: 0;
        }
    }
</style>