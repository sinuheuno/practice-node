export default {
  getters: {
    getAccessToken() {
      return localStorage.simAccessToken
    }
  },
  setters: {
    setAccessToken(token) {
      localStorage.simAccessToken = token
    }
  },
  logOut() {
    localStorage.removeItem('simAccessToken')
  }
}
