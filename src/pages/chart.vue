<template>
  <v-container>
    <v-row>
      <v-card>
        <v-tabs v-model="categoryTab">
          <v-tab
            v-for="tab in category"
            color="primary"
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-container>
          <v-row class="ml-1">
            <v-col class="item">
              <v-select
                v-model="subcategorySelect"
                :items="subcategory[categoryTab]"
                label="アイテムの種類"
                :rules="[v => !!v || '種類を選択してください']"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="name"
                :items="items"
                label="アイテム名"
                :rules="[v => !!v || 'アイテムを選択してください']"
              />
            </v-col>
            <v-col class="ma-1">
              <v-btn @click="addDisplayItems" color="primary" large><v-icon> mdi-plus </v-icon></v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-3">
            <v-chip
              class="ma-1"
              v-for="(tag, index) in displayItems"
              :key="tag"
              v-if="chips[index]"
              close
              @click:close="chipsClose(index)"
            >
              {{ tag }}
            </v-chip>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
    <v-row>
    </v-row>
    <v-row>
      <Graph class="graph mt-3 pa-3"/>
    </v-row>
  </v-container>
</template>

<script>
import category from "../static/category";

export default {
  name: "chart",
  data: () => ({
    categoryTab: 4, //タブの初期位置を素材に指定
    subcategorySelect: 'OPカプセル',
    items: [],
    name: 'C/アビリティⅢ',
    size: 15,
    isDisabled: false,

    chips: [true],

    test: ""
  }),
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
          this.items = err
        })
    },
    addDisplayItems() {
      //this.displayItems.push(this.name)
      this.$store.commit('chart/add', this.name)
      this.chips[this.displayItems.length-1] = true
    },
    chipsClose(index) {
      this.$store.commit('chart/remove', this.displayItems[index])
      this.chips.splice(index, 1)
      //this.displayItems.splice(index, 1)

    },
  },
  computed: {
    displayItems() {
      return this.$store.getters["chart/getList"]
    },
    category() {
      return category.category
    },
    subcategory() {
      return category.subcategory
    }
  },
  watch: {
    subcategorySelect: function () {
      this.valid = true
      this.getItemList()
      this.name = null
    },
  },
  mounted() {
    this.getItemList()
    for (const i of this.displayItems) {
      this.chips.push(true)
    }
  }
}
</script>

<style scoped>
.graph {
  width: 100vw;
}
</style>
