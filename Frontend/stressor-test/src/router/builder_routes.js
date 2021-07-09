import store from "@/store/index.js";
import Home from "@/views/Builder/Home.vue";
import Create from "@/views/Builder/Create.vue";
import Modify from "@/views/Builder/Modify.vue";
import Steps from "@/views/Builder/Steps.vue";

export const b_routes = [
  {
    path: "/builder",
    component: {
      render(c) {
        return c("router-view");
      },
    },
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "create",
        name: "Create",
        component: Create,
        beforeEnter: (to, from, next) => {
          store.commit("settings/setEditionMode", false);
          next();
        },
      },
      {
        path: "modify",
        name: "Modify",
        component: Modify,
      },
      {
        path: "steps",
        name: "Steps",
        component: Steps,
      },
      // Not found page
      {
        path: "*",
        component: Home,
      },
    ],
  },
];
