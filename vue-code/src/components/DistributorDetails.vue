<template>
  <div>
    <br />
    <br />
    <p>
      <span class="font-weight-bold">Nombre:</span>
      {{ selectedDistributor.name }}
    </p>
    <p>
      <span class="font-weight-bold">Teléfono:</span>
      {{ selectedDistributor.phone_number }}
    </p>
    <p>
      <span class="font-weight-bold">Email:</span>
      {{ selectedDistributor.email }}
    </p>
    <p>
      <span class="font-weight-bold">Fecha registro:</span>
      {{ formatDate(selectedDistributor.register_date) }}
    </p>
    <p>
      <span class="font-weight-bold">Ciudad:</span>
      {{ selectedDistributor.city }}
    </p>
    <p>
      <span class="font-weight-bold">Registrado por:</span>
      {{ selectedDistributor.registered_by.name }}
    </p>
    <p v-if="generatingDistributorReport" class="text-center">
      <b-spinner class="text-center" variant="primary" type="grow" label="Spinning"></b-spinner>
    </p>
    <p v-if="!generatingDistributorReport">
      <b-button @click="getDistributorReport">Reporte</b-button>
    </p>
    <div>
      <b-modal id="bv-modal-report" hide-footer>
        <template
          v-slot:modal-title
        >Reporte {{ selectedDistributor !== null ? selectedDistributor.name : ''}}</template>
        <div class="d-block text-center">
          <p>
            <strong>SIMs Activados:</strong>
            {{ result.activatedSims }}
          </p>
          <p>
            <strong>SIMs no activados:</strong>
            {{ result.notActivatedSims }}
          </p>
          <p>
            <strong>Total SIMs:</strong>
            {{ result.activatedSims + result.notActivatedSims }}
          </p>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-report')">Cerrar</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import httpManager from '../utils/http-manager'
import modals from '../utils/modals'

export default {
  data() {
    return {
      result: {
        activatedSims: 0,
        notActivatedSims: 0
      },
      generatingDistributorReport: false
    };
  },
  props: {
    selectedDistributor: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      let formatedDate = new Date(date)
      return formatedDate.toLocaleString()
    },
    getDistributorReport() {
      let _this = this;
      _this.generatingDistributorReport = true
      let config = httpManager.getConfig()

      axios
        .get(
          httpManager.getSIMsGeneralReport + '/' + this.selectedDistributor._id,
          config
        )
        .then(response => {
          this.result = response.data.result
          _this.generatingDistributorReport = false
          this.$bvModal.show('bv-modal-report')
        })
        .catch(error => {
          _this.generatingDistributorReport = false
          modals.error(error)
        });
    }
  }
};
</script>
