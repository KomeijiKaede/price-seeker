<template>
  <v-container>
    <v-card class="price-form">
      <v-container>
        <v-row>
          <v-tabs v-model="categoryTab">
            <v-tab
              v-for="tab in category"
              color="primary"
            >
              {{ tab }}
            </v-tab>
          </v-tabs>
          <v-col>
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
          </v-col>
          <v-col>
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
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
        >
          {{ snackbar_text }}
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
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {VMoney} from 'v-money'

export default {
  name: "price-form",
  data: () => ({
    /* メニューの状態と初期値 */
    categoryTab: 4, //タブの初期位置を素材に指定
    category: [
      '武器',
      '防具',
      'コスチューム/パーツ/武器迷彩',
      '消費アイテム',
      '素材',
      'その他'
    ],
    subcategorySelect: 'OPカプセル',
    subcategory: [
      // 武器
      [
        'ソード',
        'ワイヤードランス',
        'パルチザン',
        'ツインダガー',
        'ダブルセイバー',
        'ナックル',
        'カタナ',
        'デュアルブレード',
        'アサルトライフル',
        'ランチャー',
        'ツインマシンガン',
        'バレットボウ',
        'ロッド',
        'タリス',
        'ジェットブーツ',
        'タクト',
      ],
      // 防具
      [],
      // コスチューム/パーツ/武器迷彩
      [
        '武器迷彩',
        'コスチューム',
        'パーツ',
        'その他'
      ],
      // 消費アイテム
      [
        'ロビーアクション',
        'アウターウェア',
        'ベースウェア',
        'インナーウェア',
        'セットウェア',
        'アクセサリー',
        'その他'
      ],
      // 素材
      [
        'OPカプセル',
        'トリガー',
        'その他'
      ],
      // その他
      [
        '潜在能力開放代用材',
        '限界突破代用材',
        'ミュージックディスク',
        'その他'
      ]
    ],
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
    snackbar: null,
    snackbar_text: '',
    //recent: [],

    /* add items */


    resp: '',
    test: ''
  }),
  directives: { money: VMoney },
  methods: {
    submit() {
      if (!process.browser) return
      this.$refs.form.validate()
      if (!this.valid) return
      if (Number(this.price.replace(/,/g, '')) < 1000) {
        this.snackbar = true
        this.snackbar_text = '1,000 N-メセタ未満にはできません'
        return
      }

      this.loading = true
      this.$axios.get(`${location.protocol}//${location.hostname}:${location.port}/api/submit`, {
        params: {
          name: this.name,
          type: this.subcategorySelect,
          price: Number(this.price.replace(/,/g, ''))
        }}, null
      )
        .then(res => {
          this.resp = res.data
          this.snackbar_text = '登録しました'
          //this.recent.unshift({name: this.name, price: this.price, id: res.data._id, show: true})
          this.$store.commit('recent/add', {name: this.name, price: this.price, id: res.data._id, show: true})
        })
        .catch(err => {
          this.resp = err
          this.snackbar_text = '失敗しました'
        })
        .finally(() => {
          this.loading = false
          this.snackbar = true
          this.price = 0
        })
    },
    deleteItem(data) {
      if (!process.browser) return
      this.$axios.get(`${location.protocol}//${location.hostname}:${location.port}/api/delete`, {
        params: {
          index: 'price',
          id: data.id
        }}, null
      )
        .then(res => {
          this.test = res.data
          this.snackbar = true
          this.snackbar_text = '削除しました'
          this.name = data.name
          this.price = Number(data.price)
          this.$store.commit('recent/remove', data)
        })
        .catch(err => {
          this.snackbar = true
          this.snackbar_text = '削除に失敗しました'
        })
        .finally(() => {

        })
    },
    getItemList() {
      if (!process.browser) return
      this.$axios.get(`${location.protocol}//${location.hostname}:${location.port}/api/item_list`, {
        params: {
          subcategory: this.subcategorySelect
        }
      })
        .then(res => {
          this.items = []
          this.resp = res
          for (const item of res.data.hits.hits) {
            this.items.push(item._source.name)
          }
        })
        .catch(err => {
          this.items = err
        })
    },

    async getData() {
      if (!process.browser) return
      await this.$axios.$get(`${location.protocol}//${location.hostname}:${location.port}/api/search`, {
        params: {
          name: this.name,
        }
      })
        .then(res => {
          this.resp = res
        })
    }
  },

  computed: {
    recent() {
      return this.$store.getters["recent/getList"]
    }
  },

  watch: {
    subcategorySelect: function () {
      this.valid = true
      this.getItemList()
      this.name = null

    }
  },
  mounted() {
    this.getItemList()
  }
}
</script>

<style scoped>
.price-form {
  height: 60vh;
}
.price-form v-form {
  width: 80%;
}

</style>
