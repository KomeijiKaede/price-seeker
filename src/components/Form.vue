<template>
  <v-card>
    <v-container>
      <v-tabs v-model="categoryTab">
        <v-tab
          v-for="tab in category"
          color="primary"
        >
          {{ tab }}
        </v-tab>
      </v-tabs>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-select
          v-model="subcategorySelect"
          :items="subcategory[categoryTab]"
          label="アイテムの種類"
          :rules="[v => !!v || '種類を選択してください']"
        />
        <v-autocomplete
          v-model="name"
          :items="items"
          label="アイテム名"
          :rules="[v => !!v || 'アイテムを選択してください']"
        />
        <v-text-field
          v-model="price"
          v-money="money"
          label="値段"
        />
        <v-btn
          @click="submit"
          :loading="loading"
          :disabled="loading || !valid"
          color="primary"
        >
          登録
        </v-btn>
      </v-form>
    </v-container>
    <Snackbar/>
  </v-card>
<!--  <v-card>-->
<!--    <v-form>-->
<!--      <v-select-->
<!--        v-model="itemSelect"-->
<!--        :items="category"-->
<!--      />-->
<!--    </v-form>-->
<!--  </v-card>-->
</template>

<script>
import {VMoney} from 'v-money'
import category from "../static/category"

export default {
  name: "Form",
  data: () => ({
    /* メニューの状態と初期値 */
    categoryTab: 4, //タブの初期位置を素材に指定

    subcategorySelect: 'OPカプセル',

    name: null,

    items: [],

    price: 1000,

    /* v-moneyの設定 */
    money: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 0,
    },

    /* validation */
    valid: true,
    loading: false,

    /* アイテム追加 */
    itemSelect: null,

    test: null,
  }),
  directives: { money: VMoney },
  computed: {
    category() {
      return category.category
    },
    subcategory() {
      return category.subcategory
    }
  },

  watch: {
    categoryTab: function () {
      this.items.splice(0, this.items.length)
      this.subcategorySelect = ''
      this.name = ''
    },
    subcategorySelect: function () {
      if (this.subcategorySelect === '') return
      this.getItemList()
    }
  },

  methods: {
    getItemList() {
      if (!process.browser) return
      this.$axios.get(`${location.protocol}//${location.hostname}:${location.port}/api/items`, {
        params: {
          subcategory: this.subcategorySelect
        }
      })
        .then(res => this.items = res.data.items)
        .catch(err => {
        })
    },

    submit() {
      if (!process.browser) return
      this.loading = true
      this.$axios.post(`${location.protocol}//${location.hostname}:${location.port}/api/submit`, {
        name: this.name,
        category: this.categoryTab,
        subcategory: this.subcategorySelect,
        price: Number(this.price.replace(/,/g, ''))
      }, null)
        .then(res => {
          this.$store.commit('recent/add', { name: res.data.name, price: res.data.price, id: res.data.id })
          this.$store.commit('snackbar/setSnackbar', res.data.message)
        })
        .catch(err => {
          this.$store.commit('snackbar/setSnackbar', err.response.data.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

  mounted() {
    this.getItemList()
  }
}
</script>

<style scoped>
</style>
