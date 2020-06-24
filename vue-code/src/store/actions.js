import axios from 'axios'
import httpManager from '../utils/http-manager'
import authentication from '../utils/authentication'
import Router from '../router'

export default {
  getDistributors({ commit }, payload) {
    let config = httpManager.getConfig()

    axios.get(httpManager.distributorsUrl, config)
      .then(response => {
        if (response.data.message === 'Access token expired') {
          authentication.logOut()
          Router.push('/login')
        }
        commit('commitDistributorsList', response.data.data)
      }).catch(function (error) {
        payload.msgBoxOk('Error al conectarse al servidor ' + error, {
          title: 'Error',
          size: 'lg',
          buttonSize: 'lg',
          okVariant: 'danger'
        })
      })
  },
  setDistributor({ commit }, payload) {
    commit('commitDistributor', payload)
  }
}