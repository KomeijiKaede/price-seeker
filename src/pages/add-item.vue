<template>
  <v-card>
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
        :items="select.subcategory"
        label="サブカテゴリ"

      />
      <v-text-field
        v-model="name"
        label="アイテム名"
      />
      <v-btn
        @click="check"
        color="primary"
      >
        登録
      </v-btn>
    </v-form>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbar_text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          @click="snackbar = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "add-item",
  data: () => ({
    msg: "",
    snackbar: false,
    snackbar_text: "",
    test: null,
    select: "",
    subselect: "",
    resp: null,
    name: "",
    category: [
      {
        name: '武器',
        subcategory: [
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
        ]
      },
      {
        name: '防具',
        subcategory: []
      },
      {
        name: 'コスチューム/パーツ/武器迷彩',
        subcategory: [
          '武器迷彩',
          'コスチューム',
          'パーツ',
          'その他'
        ]
      },
      {
        name: '消費アイテム',
        subcategory: [
          'ロビーアクション',
          'アウターウェア',
          'ベースウェア',
          'インナーウェア',
          'セットウェア',
          'アクセサリー',
          'その他'
        ]
      },
      {
        name: '素材',
        subcategory: [
          'OPカプセル',
          'トリガー',
          'その他'
        ]
      },
      {
        name: 'その他',
        subcategory: [
          '潜在能力開放代用材',
          '限界突破代用材',
          'ミュージックディスク',
          'その他'
        ]
      },
    ],
  }),
  methods: {
    submit() {
      if (!process.browser) return
      this.loading = true
      this.$axios.get(`${location.protocol}//${location.hostname}:${location.port}/api/register_item`, {
        params: {
          name: this.name,
          category: this.select.name,
          subcategory: this.subselect
        }}, null
      )
        .then(res => {
          this.snackbar = true
          this.snackbar_text = "登録しました"
        })
        .catch(err => {
          this.msg = err
          this.snackbar = true
          this.snackbar_text = "失敗しました"
        })
        .finally(() => {
        })
    },

    check() {
      if (!process.browser) return
      if (this.select === "" || this.subselect === "" || this.name === "") {
        this.snackbar = true
        this.snackbar_text = ""
      }
      this.$axios.post(`${location.protocol}//${location.hostname}:${location.port}/api/exists`, {
        params: {
          name: this.name
        }}
      )
        .then(res => {
          if(res.data === 1) {
            this.snackbar = true
            this.snackbar_text = "そのアイテムはすでに登録されています"
          } else if (res.data === 0) {
            this.submit()
          }
        })
        .catch(err => {
          this.msg = err
        })
    }
  }
}
</script>

<style scoped>

</style>
