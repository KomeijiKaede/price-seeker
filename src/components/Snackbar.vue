<template>
  <v-snackbar
    v-model="snackbar"
  >
    {{ getText }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "Snackbar",
  data: () => ({
    snackbar: false
  }),
  methods: {
    ...mapActions('snackbar', ['openSnackbar', 'closeSnackbar']),
    ...mapGetters('snackbar', ['getSnackbar', 'existsSnackbar'])
  },
  computed: {
    isSHow() {
      return this.existsSnackbar()
    },
    getText() {
      return this.getSnackbar()
    }
  },
  watch: {
    isSHow: function () {
      this.snackbar = this.existsSnackbar()
    },
    snackbar: function () {
      if (!this.snackbar) {
        this.closeSnackbar()
      }
    }
  }
}
</script>

<style scoped>

</style>
