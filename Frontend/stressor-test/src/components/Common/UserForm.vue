<template>
  <v-form v-model="valid" ref="user_form">
    <v-row justify="center">
      <v-col cols="10" class="px-0">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-md-h5 text-h6 font-weight-bold">
              User Information
            </v-list-item-title>
            <v-list-item-subtitle>
              Please fill the following information
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="10" md="4">
        <v-text-field
          dense
          v-model="user.email"
          :rules="[rules.required, rules.email]"
          label="Email"
          outlined
          clearable
          color="light-blue"
          required
          @input="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="10" sm="4" md="3">
        <v-text-field
          v-model="user.age"
          :rules="[rules.age, rules.required]"
          dense
          label="Age"
          outlined
          color="light-blue"
          @input="validate()"
        ></v-text-field>
      </v-col>
      <v-col cols="10" sm="6" md="3">
        <v-select
          v-model="user.gender"
          :items="gender_list"
          item-text="text"
          item-value="value"
          dense
          label="Gender"
          outlined
          color="light-blue"
          validate-on-blur
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: "UserForm",
  data() {
    return {
      valid: false,
      user: { email: null, age: null, gender: null },
      gender_list: [
        { text: "Female", value: "female" },
        { text: "Male", value: "male" },
        { text: "Intersex", value: "inter" },
        { text: "Prefer not to say", value: "na" },
      ],
      rules: {
        required: (value) => !!value || "Required.",
        age: (value) => (!isNaN(value) && value > 0) || "Invalid age",
        email: (value) => {
          return /.+@.+\..+/.test(value) || "E-mail must be valid";
        },
      },
    };
  },
  methods: {
    validate() {
      this.$refs.user_form.validate();
    },
  },
};
</script>

<style></style>
