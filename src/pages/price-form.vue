<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <Form/>
        <RegisterItem class="register"/>
        <EventForm class="event"/>
      </v-col>
      <v-col>
        <Recent class="recent"/>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
export default {
  name: "test",
}
</script>

<style scoped>
.register {
  margin-top: 1em;
}
.event {
  margin-top: 1em;
}
.recent {
  width: 20vw;
}
</style>
