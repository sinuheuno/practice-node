<template>
  <div>
    <b-form @submit.prevent="onSubmit" v-if="showForm">
      <b-form-group id="input-group-name" label="Nombre:" label-for="name-input">
        <b-form-input id="name-input" v-model="form.name" type="text" required placeholder="Nombre"></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-email" label="Ingrese email:" label-for="email-input">
        <b-form-input
          id="email-input"
          v-model="form.email"
          type="email"
          required
          placeholder="email"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-phone-number"
        label="Ingrese número telefónico:"
        label-for="phone-number-input"
      >
        <b-form-input
          id="phone-number-input"
          v-model="form.phone_number"
          type="tel"
          required
          placeholder="Ingrese número telefónico"
          maxlength="10"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-city" label="Ingrese ciudad:" label-for="city-input">
        <b-form-input id="city-input" v-model="form.city" type="text" required placeholder="Ciudad"></b-form-input>
      </b-form-group>
      <b-row v-if="!showDistributorSpinner">
        <b-col>
          <b-button @click="toggleForm" variant="danger">Cancelar</b-button>
        </b-col>
        <b-col>
          <b-button type="submit" variant="primary">Guardar</b-button>
        </b-col>
      </b-row>
      <b-row v-if="showDistributorSpinner">
        <b-col>
          <b-spinner class="text-center" variant="primary" type="grow" label="Spinning"></b-spinner>
          <h3>Guardando Distribuidor</h3>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import authentication from '../utils/authentication'
import httpManager from '../utils/http-manager'
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        name: null,
        email: null,
        phone_number: null,
        city: null
      },
      showDistributorSpinner: false
    }
  },
  props: {
    showForm: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onSubmit() {
      this.showDistributorSpinner = true
      let modal = this.$bvModal
      let date = new Date()
      let dateInMilli = date.getTime()
      this.form['register_date'] = dateInMilli
      let data = this.form
      let config = httpManager.getConfig()

      axios
        .post(httpManager.distributorsUrl, data, config)
        .then(response => {
          if (response.data.message.status === 'success') {
            this.$bvModal.msgBoxOk('Distribuidor agregado', {
              title: 'Éxito',
              size: 'lg',
              buttonSize: 'lg',
              okVariant: 'success'
            })

            this.showDistributorSpinner = false
            this.getDistributors(this.$bvModal)
            this.newNumbers = ''
            this.form = {
              name: null,
              phone_number: null,
              email: null
            }
            this.$emit('toggleForm')
          } else {
            if (response.data.message === 'Access token expired') {
              this.showDistributorSpinner = false
              this.$bvModal
                .msgBoxOk('Sesión expirada. Vuelve a iniciar sesión.', {
                  title: 'Error',
                  size: 'lg',
                  buttonSize: 'lg',
                  okVariant: 'success'
                })
                .then(response => {
                  if (response) {
                    this.$router.push('/login')
                    authentication.logOut()
                  }
                })
            } else {
              this.showDistributorSpinner = false
              this.$bvModal.msgBoxOk(
                'Ocurrió un error al guardar. Intenta de nuevo',
                {
                  title: 'Error',
                  size: 'lg',
                  buttonSize: 'lg',
                  okVariant: 'success'
                }
              )
            }
          }
        })
        .catch(function(error) {
          modal.msgBoxOk('Error al conectarse al servidor ' + error, {
            title: 'Error',
            size: 'lg',
            buttonSize: 'lg',
            okVariant: 'danger'
          })
        })
      this.showDistributorSpinner = false
    },
    toggleForm() {
      if (this.showForm) {
        this.form = {
          name: null,
          phone_number: null,
          email: null
        }
        this.$emit('toggleForm')
      }
    },
    ...mapActions(['getDistributors'])
  }
}
</script>