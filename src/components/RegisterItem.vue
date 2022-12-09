<template>
  <v-card>
    <v-card-title>アイテムの新規追加</v-card-title>
    <v-container>
      <v-form>
        <v-select
          v-model="select"
          :items="category"
          item-text="name"
          item-value="id"
          return-object
          label="カテゴリ"
        />
        <v-select
          v-model="subselect"
          :items="subcategory[category.indexOf(select)]"
          label="アイテムの種類"

        />
        <v-text-field
          v-model="name"
          label="アイテム名"
        />
        <v-btn
          @click="submit"
          color="primary"
        >
          登録
        </v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import category from "../static/category"

export default {
  name: "RegisterItem",
  data: () => ({
    select: null,
    subselect: null,
    name: null
  }),
  computed: {
    category() {
      return category.category
    },
    subcategory() {
      return category.subcategory
    }
  },
  methods: {
    submit() {
      if (!process.browser) return
      this.loading = true
      this.$axios.post(`${location.protocol}//${location.hostname}:${location.port}/api/register_item`, {
        name: this.name,
        category: this.select,
        subcategory: this.subselect
      }, null)
        .then(res => {
          this.$store.commit('snackbar/setSnackbar', res.data.message)
        })
        .catch(err => {
          this.$store.commit('snackbar/setSnackbar', err.response.data.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
