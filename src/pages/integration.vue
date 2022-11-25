<template>
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
        v-model="size"
        label="取得データ数"
      />
      <v-btn
      >
        追加
      </v-btn>
    </v-row>
    <v-row>
      <v-menu
        v-model="range_menu_start"
        :close-on-content-click="false"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="range_start" outlined dense v-bind="attrs" v-on="on"/>
        </template>
        <v-card>
          <v-tabs v-model="range_tab_start">
            <v-tab href="#tab-1">Absolute</v-tab>
            <v-tab href="#tab-2">Relative</v-tab>
            <v-tab href="#tab-3">Now</v-tab>
          </v-tabs>
          <v-tabs-items v-model="range_tab_start">
            <v-tab-item value="tab-1"><v-date-picker v-model="range_start"/></v-tab-item>
            <v-tab-item value="tab-2">{{ range_start }}</v-tab-item>
            <v-tab-item value="tab-3"></v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-menu>
      <v-icon>mdi-arrow-right</v-icon>
      <v-menu
        v-model="range_menu_end"
        :close-on-content-click="false"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="range_end" outlined dense v-bind="attrs" v-on="on"/>
        </template>
        <v-card>
          <v-tabs v-model="range_tab_end">
            <v-tab href="#tab-1">Absolute</v-tab>
            <v-tab href="#tab-2">Relative</v-tab>
            <v-tab href="#tab-3">Now</v-tab>
          </v-tabs>
          <v-tabs-items v-model="range_tab_end">
            <v-tab-item value="tab-1"><v-date-picker v-model="range_end"/></v-tab-item>
            <v-tab-item value="tab-2">{{ range_end }}</v-tab-item>
            <v-tab-item value="tab-3"></v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-menu>
    </v-row>
    <v-row>
      <v-col>
        <Graph :name="name" :size="size" :gte="range_start" :lte="range_end" :isSetRange="false"></Graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "integration",
  data: () => ({
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
    name: 'C/アビリティⅢ',
    size: 15,

    range_tab_start: "tab-1",
    range_tab_end: "tab-1",
    range_menu_start: "",
    range_menu_end: "",
    range_start: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    range_end: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    items: [],
    test: ""
  }),
  methods: {
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
  }
}
</script>

<style scoped>

</style>
