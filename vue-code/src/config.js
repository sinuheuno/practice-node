export default {
  environment: 'prod',
  environments: {
    dev: {
      baseUrl: 'http://localhost:8080/api/v1'
    },
    prod: {
      baseUrl: '/api/v1'
    }
  }
}