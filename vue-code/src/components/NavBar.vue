<template>
  <div>
    <b-navbar toggleable="lg" type="dark" style="background-color: #002496">
      <b-navbar-brand>
        <img src="../assets/telcel.png" style="width: 100px" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              variant="danger"
              @click="logOut()"
              v-if="$route.name !== 'Login'"
            >Cerrar sesión</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import authentication from '../utils/authentication'

export default {
  methods: {
    logOut() {
      authentication.logOut()
      this.$router.push('/login')
    }
  }
}
</script>