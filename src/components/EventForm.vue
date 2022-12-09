<template>
  <v-card>
    <v-card-title>イベントの登録</v-card-title>
    <v-container>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field
              v-model="name"
              label="名前"
            />
            <v-textarea
              v-model="description"
              label="詳細"
            />
            <v-btn
              color="primary"
            >
              登録
            </v-btn>
          </v-col>
          <v-col>
            <v-date-picker
              landscape
              v-model="date"
            />
          </v-col>
        </v-row>

      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "EventForm",
  data: () => ({
    name: null,
    description: null,
    date: null
  })
}
</script>

<style scoped>

</style>
