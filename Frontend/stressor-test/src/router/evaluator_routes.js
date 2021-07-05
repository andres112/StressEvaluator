import store from "@/store/index.js";
import Home from "@/views/Evaluator/Home.vue";
import Create from "@/views/Evaluator/Create.vue";
import Modify from "@/views/Evaluator/Modify.vue";
import Steps from "@/views/Evaluator/Steps.vue";

export const e_routes = [
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
