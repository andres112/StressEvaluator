<template>
  <v-card flat>
    <!-- Edition mode section -->
    <v-card-text v-if="edition_mode">
      <v-row>
        <v-col cols="3" sm="2" class="editor-toolbox">
          <p
            class="mb-2 text-subtitle-2 text-sm-subtitle-1 text-md-h6 font-weight-bold"
          >
            Stressor
          </p>
          <v-select
            class="mx-1"
            v-model="stressor"
            :items="dropdown_items"
            label="Select stressor type"
            solo
            dense
          ></v-select>
          <v-divider></v-divider>
          <p
            class="mb-2 text-subtitle-2 text-sm-subtitle-1 text-md-h6 font-weight-bold"
          >
            Properties
          </p>
        </v-col>
        <v-divider vertical class="my-2"></v-divider>
        <v-col cols="9">
          <h2
            class="mb-4 text-subtitle-2 text-sm-subtitle-1 text-md-h6 font-weight-bold editor-title"
          >
            Editor
          </h2>
          <v-row>
            <v-col cols="12" class="editor-content" ref="editor"> </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Stressor",
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
};
</script>

<style></style>
