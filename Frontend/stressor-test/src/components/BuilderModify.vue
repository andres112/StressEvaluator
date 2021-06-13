<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-card class="text-center mt-5" elevation="0">
        <v-card-title
          class="text-md-h2 text-sm-h4 text-h5 font-weight-bold mb-6"
        >
          Stress Evaluator - Builder
        </v-card-title>
        <v-card-text>
          <v-col cols="12" class="mx-auto">
            <v-text-field
              v-model="id"
              label="Evaluation Id"
              outlined
              clearable
              color="light-green"
              class="mb-1"
              hint="UUID version 4 format"
            ></v-text-field>
          </v-col>
          <v-row class="mx-auto">
            <v-col md="6">
              <v-text-field
                v-model="name"
                label="Evaluation name"
                outlined
                clearable
                color="light-green"
                hint="3 charaters at least"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="owner"
                label="Evaluation owner"
                outlined
                clearable
                color="light-green"
                hint="3 charaters at least"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            color="light-green"
            class="mt-2 text-capitalize"
            large
            @click.prevent="onSubmit()"
            elevation="2"
          >
            <v-icon color="white">mdi-magnify</v-icon>
            <span class="text-h6 font-weight-bold mx-2 white--text"
              >Search</span
            >
          </v-btn>
        </v-card-text>
      </v-card>
    </v-layout>

    <!-- Result secton: table -->
    <v-card class="mt-2">
      <v-card-title class="text-md-h4 text-subtitle-1 font-weight-bold mb-6">
        Result
      </v-card-title>
      <v-data-table
        :headers="result_headers"
        :loading="result_loading"
        :items="test_list"
        :items-per-page="10"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon large @click="onContinue(item)" color="green">
            mdi-play
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "BuilderModify",
  data() {
    return {
      result_loading: false,
      result_headers: [
        { text: "Test Id", align: "start", value: "_id", sortable: false },
        { text: "Name", value: "name" },
        { text: "Owner", value: "owner" },
        { text: "Select", value: "actions", sortable: false },
      ],
      id: null,
      name: null,
      owner: null,
    };
  },
  created() {
    // clean results every time this components is loaded
    this.setTestList([]);
  },
  computed: {
    ...mapState({ test_list: (state) => state.evaluator.test_list }),
    validate() {
      if (!this.id && !this.name && !this.owner) {
        return false;
      }
      if (
        (this.name && this.name.length > 0 && this.name.length < 3) ||
        (this.owner && this.owner.length > 0 && this.owner.length < 3)
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions({
      searchMultiple: "evaluator/searchMultipleEvaluations",
      searchOne: "evaluator/searchOneEvaluation",
    }),
    ...mapMutations({
      setSelectedTest: "evaluator/setSelectedTest",
      setTestList: "evaluator/setTestList",
    }),
    onSubmit() {
      if (!this.validate) return;

      if (this.id) {
        this.result_loading = true;
        this.searchOne(this.id);
        return;
      }
      if (this.name || this.owner) {
        this.result_loading = true;
        this.searchMultiple({ name: this.name, owner: this.owner });
        return;
      }
    },
    onContinue(test) {
      this.setSelectedTest(test);
      //TODO: create a loading variable before to sent next view
      this.$router.push(`/builder/steps`);
    },
  },
  watch: {
    test_list() {
      //Stop loading when test_list is received
      this.result_loading = false;
    },
  },
};
</script>

<style></style>
