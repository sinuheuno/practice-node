<template>
  <div>
    <b-container>
      <b-row>
        <div class="col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12">
          <span class="d-lg-none">Distribuidores:</span>
          <div v-if="distributors.length > 1">
            <b-form-select
            v-model="selectedDistributor"
            @change="getDistributorSims"
            :options="distributors"
            v-if="!showForm"
          ></b-form-select>
          </div>
          <span v-if="distributors.length === 1">Cargando distribuidores...</span>
          <div v-if="selectedDistributor !== null" class="text-left">
            <DistributorDetails :selectedDistributor="selectedDistributor" />
          </div>
          <br />
          <br />
          <b-row>
            <b-col v-if="!generatingGeneralReport">
              <b-button
                variant="primary"
                v-if="!showForm"
                @click="getGeneralReport"
              >Ver Reporte General</b-button>
            </b-col>
            <b-col v-if="generatingGeneralReport">
              <b-spinner class="text-center" variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-col>
              <b-button variant="success" v-if="!showForm" @click="toggleForm">Agregar Distribuidor</b-button>
            </b-col>
          </b-row>
          <br />
          <br />

          <DistributorForm
            :showForm="showForm"
            :selectedDistributor="selectedDistributor"
            @toggleForm="toggleForm"
          />
        </div>
        <div class="col-md-4 col-lg-4 col-xl-4 col-sm-10">
          <NumbersList :sims="selectedSims" />

          <div v-if="selectedDistributor === null">
            <p>Elija un distribuidor</p>
          </div>
        </div>
        <div class="col-md-4 col-lg-4 col-xl-4 col-sm-10">
          <NumbersTextArea
            :showNumbersSpinner="showNumbersSpinner"
            :selectedDistributor="selectedDistributor"
            @setSelectedDistributor="setSelectedDistributor"
            @setShowNumbersSpinner="setShowNumbersSpinner"
            @setSims="setSims"
          />
        </div>
      </b-row>
      <div></div>
    </b-container>
    <div>
      <b-modal id="bv-modal-general-report" hide-footer>
        <template v-slot:modal-title>Reporte General</template>
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
        <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-general-report')">Cerrar</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import axios from 'axios'

import DistributorForm from '../components/DistributorForm'
import DistributorDetails from '../components/DistributorDetails'
import NumbersList from '../components/NumbersList'
import NumbersTextArea from '../components/NumbersTextArea'

import modals from '../utils/modals'
import httpManager from '../utils/http-manager'
import authentication from '../utils/authentication'

export default {
  name: 'Home',
  components: {
    DistributorForm,
    DistributorDetails,
    NumbersList,
    NumbersTextArea
  },
  data() {
    return {
      selectedDistributor: null,
      selectedSims: null,
      showForm: false,
      showDistributorSpinner: false,
      showNumbersSpinner: false,
      result: {
        activatedSims: 0,
        notActivatedSims: 0
      },
      generatingGeneralReport: false
    };
  },
  methods: {
    ...mapActions(['getDistributors']),
    toggleForm() {
      if (this.showForm) {
        this.showForm = !this.showForm;
      } else {
        this.selectedDistributor = null;
        this.showForm = !this.showForm;
      }
    },
    formatDate(date) {
      let formatedDate = new Date(date)
      return formatedDate.toLocaleString()
    },
    setSelectedDistributor(distributor) {
      this.selectedDistributor = distributor
    },
    setShowNumbersSpinner(value) {
      this.showNumbersSpinner = value
    },
    setSims (value) {
      this.selectedSims = value
    },
    getGeneralReport() {
      let _this = this;
      this.generatingGeneralReport = true

      let config = {
        headers: {
          Authorization: 'Bearer ' + authentication.getters.getAccessToken()
        }
      };

      axios
        .get(httpManager.getSIMsGeneralReport, config)
        .then(response => {
          this.result = response.data.result
          this.generatingGeneralReport = false
          this.$bvModal.show('bv-modal-general-report')
        })
        .catch(error => {
          _this.generatingGeneralReport = false
          modals.error(error)
        });
    },
    getDistributorSims(distributor) {
      if (distributor !== null) {
        let config = httpManager.getConfig()

        axios
          .get(httpManager.distributorSims + '/' + distributor._id, config)
          .then(response => {
            this.selectedSims = response.data.data
          })
          .catch(error => {
            modals.error(error)
          });
      } else {
        this.selectedSims = null
      }
    }
  },
  mounted() {
    this.getDistributors(this.$bvModal)
  },
  computed: {
    ...mapState(['distributorsList']),
    distributors() {
      let formatedDistributors = [
        { value: null, text: 'Elije un distribuidor' }
      ];
      if (this.distributorsList !== undefined) {
        this.distributorsList.forEach(distributor => {
          formatedDistributors.push({
            value: distributor,
            text: distributor.name
          });
        });
      }

      return formatedDistributors
    }
  }
};
</script>
