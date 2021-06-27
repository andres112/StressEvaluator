<template>
  <div class="text-center">
    <v-snackbar
      v-model="notification.isOn"
      :timeout="notification.timeout"
      bottom
      dark
      :color="getColor"
    >
      <span class="text-h6">{{ notification.text }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="notification.isOn = false" >
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Notification",
  computed: {
    ...mapState({ notification: (state) => state.settings.notification }),
    getColor() {
      if (this.notification.status == "ok") {
        return "light-green";
      }
      if (this.notification.status == "error") {
        return "deep-orange";
      }
      return "light-blue";
    },
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
  },
  watch: {
    notification: {
      handler() {
        const aux = this;
        if (this.notification.isOn) {
          setTimeout(function() {
            aux.setNotifications({
              isOn: false,
              text: null,
              timeout: 2000,
              status: aux.notification.status,
            });
          }, aux.notification.timeout);
        }
      },
      deep: true,
    },
  },
};
</script>

<style></style>
