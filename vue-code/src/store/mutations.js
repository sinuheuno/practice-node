export default {
  commitDistributorsList(state, payload) {
    state.distributorsList = payload
  },
  commitDistributor(state, payload) {
    state.selectedDistributorOnState = payload
  }
}
