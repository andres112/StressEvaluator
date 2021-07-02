<template>
  <v-card flat>
    <h1>{{properties.title}}</h1>
  </v-card>
</template>

<script>
export default {
  name: "Arithmetic",
  data() {
    return {
      properties: {title:"Arithmetic"},
    };
  },
  // this meta parameter allows identify globally
  // must be similar than stressorList.json
  meta: { text: "Mental Arithmetic", value: "arithmetic" },
  methods: {},
};
</script>

<style></style>
