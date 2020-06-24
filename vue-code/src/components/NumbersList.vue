<template>
  <div>
    <b-list-group v-if="sims !== null && sims !== undefined">
      <div v-if="sims.length > 0" style="max-height: 300px; overflow: scroll;">
        <span>Números:</span>
        <b-list-group-item
          @click="showSIMInfo(sim)"
          style="cursor: pointer"
          v-for="(sim, index) in sims"
          :key="sim._id"
        >
          <span
            :style="sim.active ? 'color: #8e8e8e;' : ''"
          >{{ index + 1 }}.- {{ sim.phone_number }}</span>
        </b-list-group-item>
      </div>
      <div v-if="sims.length === 0">
        <p>No hay números para mostrar</p>
      </div>
    </b-list-group>
    <b-modal id="bv-modal-sim" hide-footer>
      <template v-slot:modal-title>Información SIM</template>
      <div class="d-block text-center">
        <p>
          <strong>Activado:</strong>
          {{ selectedSim.active ? 'Sí' : 'No'}}
        </p>
        <p>
          <strong>Número:</strong>
          {{ selectedSim.phone_number }}
        </p>
        <p>
          <strong>Número de serie:</strong>
          {{ selectedSim.serial_number }}
        </p>
        <p>
          <strong>Registrado por:</strong>
          {{ selectedSim.registered_by !== undefined ? selectedSim.registered_by.name : ''}}
        </p>
        <p>
          <strong>Fecha de registro:</strong>
          {{ formatDate(selectedSim.register_date) }}
        </p>
        <p>
          <strong>Fecha de activación:</strong>
          {{ selectedSim.activation_date !== undefined ? formatDate(selectedSim.activation_date) : ''}}
        </p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-sim')">Cerrar</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedSim: {}
    }
  },
  props: {
    sims: {
      required: true
    }
  },
  methods: {
    showSIMInfo(sim) {
      this.selectedSim = sim
      this.$bvModal.show('bv-modal-sim')
    },
    formatDate(date) {
      let formatedDate = new Date(date)
      return formatedDate.toLocaleString()
    }
  }
}
</script>
