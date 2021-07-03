<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <!-- Propierties section -->
        <v-col cols="10" sm="4" md="3" class="editor-toolbox">
          <p
            class="mb-2 text-subtitle-2 text-sm-subtitle-1 font-weight-bold"
          >
            Properties
          </p>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Interactive component section -->
    <!-- Readonly when editor mode is enabled -->
  </v-card>
</template>

<script>
export default {
  name: "Arithmetic",
  data() {
    return {
      properties: { title: "Arithmetic" },
    };
  },
  // This meta parameter allows identify this component globally
  // Must be similar than stressorList.json
  meta: { text: "Mental Arithmetic", value: "arithmetic" },
  methods: {
    // Method for return error or hint and time of response
    // Total of tasks shall be carried out in Stressor parent component
  },
};
</script>

<style></style>
