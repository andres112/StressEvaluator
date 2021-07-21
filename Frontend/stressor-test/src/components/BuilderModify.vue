<template>
  <v-container>
    <home-button />
    <v-layout justify-center align-center>
      <v-card class="text-center mt-5" elevation="0">
        <v-card-title class="text-md-h2 text-sm-h4 text-h5 font-weight-bold">
          Stress Evaluator
        </v-card-title>
        <p class="text-subtitle-2 mb-6 green--text">Builder Mode</p>
        <v-card-text>
          <v-form @submit.prevent="onSubmit()">
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
              elevation="2"
              type="submit"
            >
              <v-icon color="white">mdi-magnify</v-icon>
              <span class="text-h6 font-weight-bold mx-2 white--text"
                >Search</span
              >
            </v-btn>
          </v-form>
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
          <!-- Label for closed evaluation indicator -->
          <span
            v-if="item.closed"
            class="mx-auto font-weight-bold text-subtitle-1 deep-orange--text text--accent-4"
          >
            Closed
          </span>
          <v-layout v-else>
            <!-- Dialog or modal for evaluation deletion confirmation -->
            <v-dialog v-model="isDeleting" persistent max-width="350px" v-if="!item.published">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="deep-orange accent-4"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-trash-can
                      </v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </span>
              </template>
              <v-card>
                <v-card-title class="text-h5 deep-orange--text text--accent-4">
                  Danger Zone!
                </v-card-title>
                <v-card-text
                  >Are you sure you want to delete the selected evaluation?.
                  This action cann't be undone.</v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey" text @click="isDeleting = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="deep-orange accent-4"
                    text
                    @click.prevent="onDelete(item)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click.prevent="onContinue(item)"
                  color="light-green"
                  class="ml-2"
                  v-if="!item.published"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="item.published"
                  @click.prevent="onContinue(item)"
                  color="light-blue darken-2"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-eye
                </v-icon>
              </template>
              <span>Published</span>
            </v-tooltip>
          </v-layout>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import HomeButton from "@/components/Common/HomeButton.vue";

export default {
  name: "BuilderModify",
  components: {
    HomeButton,
  },
  data() {
    return {
      result_loading: false,
      result_headers: [
        { text: "Test Id", align: "start", value: "_id", sortable: false },
        { text: "Name", value: "name" },
        { text: "Owner", value: "owner" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      isDeleting: false,
      id: null,
      name: null,
      owner: null,
    };
  },
  mounted() {
    // clean results every time this components is loaded
    this.setTestList([]);
    this.cleanStates();
  },
  computed: {
    ...mapState({ test_list: (state) => state.builder.test_list }),
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
      searchMultiple: "builder/searchMultipleEvaluations",
      searchOne: "builder/searchOneEvaluation",
      setSelectedEvaluation: "builder/setSelectedEvaluation",
      deleteEvaluation: "builder/deleteEvaluation",
    }),
    ...mapMutations({
      setTestList: "builder/setTestList",
      cleanStates: "builder/cleanStates",
      setNotifications: "settings/setNotifications",
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
    async onContinue(test) {
      await this.setSelectedEvaluation(test);
      await this.$router.push(`/builder/steps`);
    },
    async onDelete(test) {
      this.isDeleting = false;
      const msg = {
        isOn: true,
        text: "Evaluation removed successfully",
        timeout: 4000,
        status: "info",
      };
      await this.deleteEvaluation(test._id);
      await this.setNotifications(msg);
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
