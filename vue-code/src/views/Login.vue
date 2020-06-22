<template>
  <div>
    <b-container>
      <b-row>
        <b-col v-if="showSpinner" class="col-md-4 col-lg-4 col-xl-4 col-sm-10 offset-sm-1 offset-md-4 offset-lg-4 offset-xl-4">
          <div class="text-center">
            <b-spinner class="text-center" variant="primary" type="grow" label="Spinning"></b-spinner><h3>Iniciando sesión</h3>
          </div>
        </b-col>
        <b-col v-if="!showSpinner" class="col-md-4 col-lg-4 col-xl-4 col-sm-10 offset-sm-1 offset-md-4 offset-lg-4 offset-xl-4">
          <b-form @submit.prevent="onSubmit">
            <b-form-group
              id="input-group-email"
              label="Correo electrónico:"
              label-for="email-input"
            >
              <b-form-input
                id="email-input"
                v-model="form.email"
                type="email"
                required
                placeholder="Email"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-password"
              label="Ingrese Contraseña:"
              label-for="password-input"
            >
              <b-form-input
                id="password-input"
                v-model="form.password"
                type="password"
                required
                placeholder="Contraseña"
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Login</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import httpManager from '../utils/http-manager'
import authentication from '../utils/authentication'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      showSpinner: false
    }
  },
  methods: {
    onSubmit () {
      this.showSpinner = true
      this.login(this.form)
    },
    login() {
      let modal = this.$bvModal
      axios.post(httpManager.loginUrl, this.form)
        .then(response => {
          if (response.data.message.code === 2001) {
            authentication.setters.setAccessToken(response.data.token)
            this.$router.push('/')
          } else {
            if (response.data.code === 1000) {
              this.$bvModal.msgBoxOk('Usuario o contraseña incorrectas', {
                title: 'Error al iniciar sesión',
                size: 'lg',
                buttonSize: 'lg',
                okVariant: 'success'
              })

              this.showSpinner = false
              this.form = {
                email: '',
                password: ''
              }
            }
          }
        }).catch(function (error) {
              modal.msgBoxOk('Error al conectarse al servidor ' + error, {
                title: 'Error',
                size: 'lg',
                buttonSize: 'lg',
                okVariant: 'danger'
              })
            })
    }
  },
  beforeMount() {
    if (localStorage.simAccessToken !== undefined) {
      this.$router.push('/')
    }
  }
}
</script>