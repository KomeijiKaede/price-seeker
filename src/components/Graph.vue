<template>
  <v-card>
    <highchart
      ref="chart"
      :options="options"
      :update="watchers"
    />
  </v-card>
</template>

<script>
export default {
  name: "Graph",
  props: {
    size: {
      type: Number,
      default: 3
    },
    gte: {
      type: String
    },
    lte: {
      Type: String
    },
    isSetRange: {
      Type: Boolean,
      default: false
    }
  },
  data: () => ({
    watchers: [
      'options'
    ],

    /* highchart option */
    options: {
      chart: { type: 'line' },
      title: { text: '' },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          month: '%e. %b',
          year: '%b'
        },
        title: { text: 'Date' }
      },
      yAxis: {
        title: { text: 'Price' },
        min: 1000
      },

      plotOptions: {
        series: {
          marker: {
            enabled: true
          }
        }
      },

      colors: ['#ff8370', '#00b1b0', '#fec84d', '#e42256'],

      series: [
        { name: "", data: [new Date(), 0] }
      ]
    }
  }),
  methods: {
    resetData() {
      this.options.series.splice(0, this.options.series.length)
    },

    async getData(name, index) {
      if (!process.browser) return

      let query = {
        name: name,
        size: this.size,
      }
      if (this.isSetRange) {
        query.gte = this.gte
        query.lte = this.lte
      }

      const resp = await this.$axios.$get(`${location.protocol}//${location.hostname}:${location.port}/api/search`, {
        params: query
      })

      this.options.series.splice(index, this.options.series.length, { name: resp.name, data: resp.items })
    },

    async load() {
      this.resetData()
      this.items.forEach((item, index) => {
        this.getData(item, index)
      })
    },
  },
  computed: {
    computedItems() {
      const list = []
      for (const i of this.items) {
        list.push(i)
      }
      return list
    },
    items() {
      return this.$store.getters["chart/getList"]
    }
  },
  watch: {
    computedItems: {
      deep: true,
      handler(nv, ov) {
        if (this.items.length === 0) this.options.series.splice(0, this.options.series.length, { name: "アイテムが選択されていません", data: [new Date(), 0] })

        // 追加されたアイテムをチェック
        const check = (array1, array2) => {
          const a1 = [...new Set(array1)]
          const a2 = [...new Set(array2)]
          return [...a1, ...a2].filter(value => !a1.includes(value) || !a2.includes(value))
        }
        const diff = check(nv, ov)

        this.test = nv.length

        if (ov.length === 0) {
          this.getData(nv[0], 0)
          this.options.series.splice(0, this.options.series.length)
        }

        if (nv.length < ov.length) {
          for (const [index, item] of this.options.series.entries()) {
            if (diff[0] === item.name) {
              this.options.series.splice(index, 1)
            }
          }
        } else {
          this.getData(diff[0], this.options.series.length)
        }

      }
    },
    size: async function() {
      if (this.size === "" || this.size === "0") return
      await this.load()
    },

    gte: async function() {
      await this.load()
    },

    lte: async function() {
      await this.load()
    },
  },
  async mounted() {
    this.items.forEach((name, index) => {
      this.getData(name, index)
    })

    //this.getData()
    //this.setData()
  }
}
</script>

<style scoped>

</style>
