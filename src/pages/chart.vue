<template>
  <v-container>
    <v-select
      v-model="name"
      :items="items"
      label="名前"
      required
    />
    <highchart
      ref="chart"
      :options="options"
      :update="['options.series']"
    />
  </v-container>
</template>

<script>
export default {
  name: "chart",
  data: () => ({
    resp: null,
    name: 'C/アームⅢ',
    items: [
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

    dataset: [],

    options: {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'price'
        },
        min: 0
      },

      plotOptions: {
        series: {
          marker: {
            enabled: true
          }
        }
      },

      colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

      series: [
        {
          name: "",
          data: []
        }
      ]
    }

  }),
  methods: {
    deleteData() {
      this.options.series.splice(0, this.options.series.length)
      this.dataset = []
    },

    async getData() {
      // Elasticsearch query
      const query = {
        sort: [{ "date" : {"order" : "asc", "format": "strict_date_optional_time_nanos"}},],
        query: {match: {'name': this.name}},
        size: 30
      }
      if (!process.browser) return
      await this.$axios.$get(`${location.protocol}//${location.hostname}:${location.port}/api/search`, {
        params: {
          name: this.name,
          source_content_type: 'application/json'
        }
      })
        .then(res => {
          this.resp = res
        })
    },

    setData() {
      for (const i of this.resp.hits.hits) {
        this.dataset.push([Date.parse(i._source.date), i._source.price])
      }
      this.options.series.splice(0, this.options.series.length, {
        name: this.resp.hits.hits[0]._source.name,
        data: this.dataset
      })
    }
  },
  watch: {
    name: async function() {
      this.deleteData()
      await this.getData()
      this.setData()
    }
  },
  async mounted() {
    await this.getData()
    this.setData()
  },
}

</script>

<style scoped>

highcharts {
  height: 30vh;
}

</style>
