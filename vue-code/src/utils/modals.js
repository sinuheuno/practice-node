export default {
  error(modal, message) {
    modal.msgBoxOk(message, {
      title: 'Error',
      size: 'lg',
      buttonSize: 'lg',
      okVariant: 'success'
    })
  }
}