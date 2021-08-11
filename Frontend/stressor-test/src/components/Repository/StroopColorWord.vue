<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <!-- Propierties section -->
        <v-col
          cols="offset-xs12"
          sm="5"
          md="4"
          lg="3"
          class="editor-toolbox"
          v-if="edition_mode"
        >
          <p class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold">
            Properties
          </p>
        </v-col>
        <v-divider vertical class="my-2" v-if="edition_mode"></v-divider>
        <!-- Interactive component section -->
        <!-- Readonly when editor mode is enabled -->
        <v-col
          cols="offset-xs12"
          :sm="edition_mode ? 7 : 12"
          :md="edition_mode ? 8 : 12"
        >
          <p
            class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold"
            v-if="edition_mode"
          >
            Component - Word Stroop
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "StroopColorWord",
  // this meta parameter allows identify globally
  // must be similar than stressorList.json
  meta: { text: "Stroop Color World", value: "stroop" },
};
</script>

<style></style>
