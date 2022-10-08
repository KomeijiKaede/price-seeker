<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-tabs v-model="tab">
          <v-tab
            v-for="type in types"
            :key="type.tab"
            color="primary"
          >
            {{ type.label }}
          </v-tab>
        </v-tabs>
        <v-form>
          <v-select
            v-model="name"
            :items="items[tab]"
            label="名前"
            required
          />
          <v-text-field
            v-model="price"
            v-money="money"
            label="値段"
          />
          <v-btn
            @click="submit"
            :loading="loading"
            :disabled="loading"
            color="primary"
          >
            登録
          </v-btn>
          <v-snackbar
            v-model="snackbar"
            :timeout="2000"
          >
            登録しました
            <template v-slot:action="{ attrs }">
              <v-btn
                color="primary"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                閉じる
              </v-btn>
            </template>
          </v-snackbar>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>>

<script>
import {VMoney} from 'v-money'
const axios = require('axios')
const elasticsearch = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
export default {
  name: "price-form",
  data: () => ({
    tab: null,
    types: [
      { tab: 'capsule', label: 'OPカプセル' },
      //{ tab: 'unit', label: 'ユニット' },
      { tab: 'material', label: '素材' },
      { tab: 'trigger', label: 'トリガー'}
    ],
    name: null,
    items: [
      [
        'C/アームⅡ',
        'C/アームⅢ',
        'C/アビリティⅡ',
        'C/アビリティⅢ',
        'C/アビリティⅣ',
        'C/アディ・アルムダ',
        'C/アディ・アルムシャ',
        'C/アディ・アルムホウ',
        'C/アルズ・セクレテⅢ',
        'C/ドレド・キーパⅢ',
      ],
      ['グライアスアーマ'],
      [
        'ストラグメントA',
        'ストラグメントB',
        'ストラグメントC',
      ],
      [
        'Bトリガー/エアルパープル',
        'Bトリガー/リテナパープル'
      ]
    ],
    price: null,
    money: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 0,
    },
    loading: false,
    snackbar: false,
    recent: []
  }),
  directives: {money: VMoney},
  methods: {
    submit() {
      this.loading = true
      elasticsearch.post(`http://localhost:9200/price/_doc/`, JSON.stringify({
        name: this.name,
        type: this.types[this.tab].label,
        price: Number(this.price.replace(/,/g, '')),
        date: new Date()
      }, null))
        .then(res => {
          this.recent.push({
            id: res.data._id,
            name: res.config.data.name,
            price: res.config.data.price
          })
        })
        .finally(() => {
          this.loading = false
          this.snackbar = true
          this.price = 0
        })
    }
  }
}
</script>

<style scoped>

</style>
