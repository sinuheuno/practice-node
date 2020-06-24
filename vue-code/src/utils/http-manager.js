import config from '../config'
import authentication from '../utils/authentication'

let baseUrl = config.environments[config.environment].baseUrl
let usersUrl = baseUrl + '/user'
let loginUrl = usersUrl + '/login'
let distributorsUrl = baseUrl + '/distributor'
let getSIMsUrl = baseUrl + '/sim'
let getSIMsGeneralReport = getSIMsUrl + '/report'
let pushSIMsUrl = getSIMsUrl + '/push'
let distributorSims = baseUrl + '/sim/distributor'

function getConfig() {
  let config = {
    headers: {
      'Authorization': 'Bearer ' + authentication.getters.getAccessToken()
    }
  }

  return config
}

export default {
  baseUrl,
  usersUrl,
  loginUrl,
  distributorsUrl,
  pushSIMsUrl,
  getSIMsUrl,
  distributorSims,
  getSIMsGeneralReport,
  getConfig,
}
