<template>
  <div>
    <div class="d-lg-none">
      <br />
      <br />
      <span>Agregar números:</span>
    </div>
    <b-form-textarea
      id="textarea"
      v-model="newNumbers"
      placeholder="Escribe los números separados por coma"
      rows="3"
      max-rows="6"
    ></b-form-textarea>
    <br />
    <b-row v-if="showNumbersSpinner">
      <b-col>
        <b-spinner class="text-center" variant="primary" type="grow" label="Spinning"></b-spinner>
        <h3>Guardando Números</h3>
      </b-col>
    </b-row>
    <b-row v-if="!showNumbersSpinner">
      <b-col>
        <b-button variant="success" @click="savePhoneNumbers()">Agregar números</b-button>
      </b-col>
    </b-row>
    <br><br>
    <b-row v-if="wrongSims.length > 0">
      <div style="max-height: 300px; width: 350px; overflow: scroll; text-align: left;">
        <p>Los siguientes números tienen errores:</p>
        <ul>
          <li v-for="(sim) in wrongSims" :key="sim._id">
            <span>Num: {{ sim.phone_number }}</span>
            <br>
            <span>SN: {{ sim.serial_number }}</span>
            <br>
          </li>
        </ul>
      </div>
    </b-row>
    <b-row v-if="wrongSimsMongo.length > 0">
      <div style="max-height: 500px; width: 350px; overflow: scroll; text-align: left;">
        <p>Los siguientes números ya se encuentran en la base de datos:</p>
        <ul>
          <li v-for="(sim) in wrongSimsMongo" :key="sim.op._id">
            <span>Num: {{ sim.op.phone_number }}</span>
            <br>
            <span>SN: {{ sim.op.serial_number }}</span>
            <br>
          </li>
        </ul>
      </div>
      <b-container>
        <b-row>
          <b-col>
            <div class="text-align: center;">
              <b-button @click="clearErrorArea">Limpiar Números</b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-row>
  </div>
</template>

<script>
import authentication from '../utils/authentication'
import httpManager from '../utils/http-manager'
import modals from '../utils/modals'

import axios from 'axios'

import { mapActions } from 'vuex'

export default {
  data() {
    return {
      newNumbers: '',
      wrongSims: [],
      wrongSimsMongo: []
    }
  },
  props: {
    showNumbersSpinner: {
      type: Boolean,
      required: true
    },
    selectedDistributor: {
      required: true
    }
  },
  methods: {
    ...mapActions(['getDistributors']),
    savePhoneNumbers() {
      this.wrongSims = []
      if (this.selectedDistributor !== null) {
        let modal = this.$bvModal
        let _this = this
        this.$emit('setShowNumbersSpinner', true)
        let trimedPhoneNumbers = this.newNumbers.replace(/\s/g, '')
        let splitedPhoneNumbers = trimedPhoneNumbers.split(',')
        let sims = []
        let wrongSims = []
        let date = new Date()
        let dateInMilli = date.getTime()
        let isNum

        for (let i = 0; i < splitedPhoneNumbers.length - 1;i += 2) {
          let sim = {
            active: false,
            phone_number: null,
            register_date: dateInMilli,
            serial_number: null
          }
          
          isNum = /^\d+$/.test(splitedPhoneNumbers[i])

          if (isNum && splitedPhoneNumbers[i].length === 10) {
            sim.phone_number = splitedPhoneNumbers[i]

            isNum = /^\d+$/.test(splitedPhoneNumbers[i +1])

            if (isNum && splitedPhoneNumbers[i +1].length === 19) {
              sim.serial_number = splitedPhoneNumbers[i + 1]
              sims.push(sim)
            } else {
              wrongSims.push({
                type: 'serial',
                message: `SIM No: ${ i }. Longitud del número de serie ${ splitedPhoneNumbers[i +1] } debe ser de 19 y contener solo caracteres numéricos`
              })
            }
          } else {
            wrongSims.push({
              type: 'number',
              message: `SIM No: ${ i }. Longitud del número telef ${ splitedPhoneNumbers[i] } debe ser de 10 y contener solo caracteres numéricos`
            })
          }
        }

        let config = httpManager.getConfig()

        axios
          .post(
            httpManager.pushSIMsUrl + '/' + this.selectedDistributor._id,
            { sims },
            config
          )
          .then(response => {
            if (response.data.message.status === 'success') {
              this.$bvModal.msgBoxOk(
                'Números guardados correctamente. Se ignoraron espacios vacíos y números erróneos',
                {
                  title: 'Éxito',
                  size: 'lg',
                  buttonSize: 'lg',
                  okVariant: 'success'
                }
              )
              this.wrongSimsMongo = []
              this.getDistributors()
              this.$emit('setSelectedDistributor', null)
              this.newNumbers = ""
              this.$emit('setShowNumbersSpinner', false)
              this.$emit('setSims', null)

              if (response.data.not_registered_sims.length > 0) {
                this.wrongSims = response.data.not_registered_sims
              }
            } else {
              if (response.data.message.code === 1003) {
                this.wrongSimsMongo = response.data.writeErrors
                this.newNumbers = ''
                _this.$emit('setShowNumbersSpinner', false)
                this.$bvModal.msgBoxOk(
                'Números guardados correctamente. Se encontraron números que ya están en la base de datos. Se mostrarán al cerrar esta ventana.',
                {
                  title: 'Éxito',
                  size: 'lg',
                  buttonSize: 'lg',
                  okVariant: 'success'
                }
              )
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
                        this.$emit('setShowNumbersSpinner', false)
                        this.$emit('setSims', null)
                      }
                    })
                } else {
                  this.$emit('setShowNumbersSpinner', false)
                  modals.error(
                    modal,
                    'Ocurrió un error al guardar. Intenta de nuevo'
                  )
                  this.$emit('setSims', null)
                }
              }
            }
          })
          .catch(function(error) {
            _this.$emit('setShowNumbersSpinner', false)
            this.$emit('setSims', null)
            modals.error(modal, 'Error al conectarse al servidor ' + error)
          })
      } else {
        this.$emit('setSims', null)
        this.$bvModal.msgBoxOk('Debes elegir un distribuidor', {
          title: 'Error',
          size: 'lg',
          buttonSize: 'lg',
          okVariant: 'success'
        })
      }
    },
    clearErrorArea () {
      this.wrongSimsMongo = []
    }
  }
}
</script>
