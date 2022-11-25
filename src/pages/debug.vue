<template>
  <v-container>
    <v-text-field
      v-model="deleteId"
    />
    <v-btn
      @click="deleteItem"
    >
      削除
    </v-btn>
    {{ resp }}
  </v-container>
</template>

<script>
export default {
  name: "debug",
  data: () => ({
    deleteId: null,
    resp: null
  }),
  methods: {
    deleteItem() {
      if (!process.browser) return
      this.$axios.post(`${location.protocol}//${location.hostname}:${location.port}/api/delete`, {
        index: 'price',
        id: this.deleteId
      })
        .then(res => {
          this.resp = res
        })
        .catch(err => this.resp = err)
    }
  }
}
</script>

<style scoped>

</style>
