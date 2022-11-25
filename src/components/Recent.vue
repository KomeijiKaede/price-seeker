<template>
  <v-card>
    <v-card-title>登録履歴</v-card-title>
    <v-card-subtitle>5件まで</v-card-subtitle>
    <v-list>
      <v-list-item
        v-for="data in recent"
      >
        <v-list-item-content>
          <v-list-item-title v-text="data.name"/>
          <v-list-item-content v-text="data.price +' N-メセタ'"/>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="deleteItem(data)">取り消し</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "Recent",
  computed: {
    recent() {
      return this.$store.getters["recent/getList"]
    }
  },
  methods: {
    deleteItem(data) {
      if (!process.browser) return
      this.$axios.post(`${location.protocol}//${location.hostname}:${location.port}/api/delete`, {
        index: 'price',
        id: data.id
      })
        .then(res => {
          this.$store.commit('snackbar/setSnackbar', res.data.message)
          this.$store.commit('recent/remove', data)
        })
        .catch(err => {
          this.$store.commit('snackbar/setSnackbar', err.response.data.message)
        })
    }
  }
}
</script>

<style scoped>

</style>
