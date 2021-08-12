<template>
  <v-container fluid>
    <p
      class="text-subtitle-2 green--text"
      v-if="edition_mode && content.type == 'radiogrid'"
    >
      Radiogroup Grid
    </p>
    <p
      class="text-subtitle-2 green--text"
      v-else-if="edition_mode && content.type == 'checkboxgrid'"
    >
      Checkbox Grid
    </p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <!-- For edition mode -->
    <v-row justify="start" v-if="edition_mode">
      <v-col cols="12" sm="10" md="5" class="mr-10">
        <p class="mb-2 text-h6 font-weight-bold mb-4">Rows</p>
        <v-row
          align="center"
          class="d-flex ml-1"
          v-for="row in content.options.rows"
          :key="row.value"
        >
          <v-text-field
            dense
            v-if="edition_mode"
            color="light-green"
            v-model.trim="row.text"
            placeholder="Option"
            counter
            maxlength="25"
            class="mr-4"
          ></v-text-field>
          <v-btn
            icon
            color="deep-orange accent-4"
            v-if="edition_mode && content.options.rows.length > 1"
            @click="deleteItem('rows', row.value)"
          >
            <v-icon small>mdi-close-thick</v-icon>
          </v-btn>
        </v-row>
        <br />
        <div v-if="edition_mode">
          <a
            class="text-subtitle-2 ml-2"
            color="light-green"
            @click="addItem('rows')"
          >
            + Add Row
          </a>
        </div>
      </v-col>
      <v-col cols="12" sm="10" md="5">
        <p class="mb-2 text-h6 font-weight-bold mb-4">Columns</p>
        <v-row
          align="center"
          class="d-flex ml-1"
          v-for="column in content.options.columns"
          :key="column.value"
        >
          <v-text-field
            dense
            v-if="edition_mode"
            color="light-green"
            v-model.trim="column.text"
            placeholder="Option"
            counter
            maxlength="25"
            class="mr-4"
          ></v-text-field>
          <v-btn
            icon
            color="deep-orange accent-4"
            v-if="edition_mode && content.options.columns.length > 1"
            @click="deleteItem('columns', column.value)"
          >
            <v-icon small>mdi-close-thick</v-icon>
          </v-btn>
        </v-row>
        <br />
        <div v-if="edition_mode">
          <a
            class="text-subtitle-2 ml-2"
            color="light-green"
            @click="addItem('columns')"
          >
            + Add Column
          </a>
        </div>
      </v-col>
    </v-row>

    <!-- For test implementation mode -->
    <v-row v-else class="mx-4">
      <v-col cols="11">
        <v-simple-table fixed-header height="23vh">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th
                  class="text-center text-subtitle-2 text-md-subtitle-1"
                  v-for="column in content.options.columns"
                  :key="column.value"
                >
                  {{ column.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in content.options.rows" :key="row.value">
                <td class="text-left text-subtitle-2 text-md-subtitle-1">
                  {{ row.text }}
                </td>
                <td
                  v-for="column in content.options.columns"
                  :key="column.value"
                  class="text-center"
                >
                  <input
                    v-if="content.type == 'radiogrid'"
                    type="radio"
                    :value="column.text"
                    :name="row.value"
                    @change="setAnswer(row, column)"
                    class="presenter-input"
                  />
                  <input
                    type="checkbox"
                    :ref="`${row.value}-${column.value}`"
                    v-else-if="content.type == 'checkboxgrid'"
                    @change="setAnswer(row, column)"
                    :value="column.text"
                    class="presenter-input"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <div class="d-inline-flex" v-if="edition_mode">
      <v-checkbox
        dense
        v-model="content.required"
        class="ml-1"
        label="Required"
      ></v-checkbox>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Question from "./Question.vue";

export default {
  name: "Grid",
  components: { Question },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: [],
      answers_map: null,
    };
  },
  created() {
    if (this.edition_mode) {
      if (this.content.options.rows.length == 0) {
        this.addItem("rows");
      }
      if (this.content.options.columns.length == 0) {
        this.addItem("columns");
      }
    } else {
      this.answers_map = new Map();
      this.content.options.rows.forEach((row) => {
        if (this.content.type == "checkboxgrid")
          this.answers_map.set(row.text, []);
        if (this.content.type == "radiogrid")
          this.answers_map.set(row.text, null);
      });
    }
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    deleteQuestion() {
      this.$emit("onDeleteQuestion", this.content.id);
    },
    addItem(item) {
      const new_option = { value: createNanoId(), text: "" };
      this.content.options[item].push(new_option);
    },
    deleteItem(item, option_id) {
      this.content.options[item] = this.content.options[item].filter(
        (x) => x.value != option_id
      );
    },
    setAnswer(key, value = null) {
      if (this.content.type == "checkboxgrid") {
        let current = this.answers_map.get(key.text);
        const checked = this.$refs[`${key.value}-${value.value}`][0].checked;
        if (checked && !current.includes(value.text)) {
          current.push(value.text);
        } else if (!checked && current.includes(value.text)) {
          current = current.filter((x) => x != value.text);
        }
        value = current;
      }
      if (this.content.type == "radiogrid") {
        value = value.text;
      }
      this.answers_map.set(key.text, value);
      this.answer_selected = Array.from(this.answers_map, ([row, column]) => ({
        row: row,
        column: column,
      }));
    },
  },
};
</script>

<style></style>
