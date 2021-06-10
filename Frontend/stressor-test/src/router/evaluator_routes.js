import Home from "@/views/Evaluator/Home.vue";
import Create from "@/views/Evaluator/Create.vue";

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
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/create",
        name: "Create",
        component: Create,
      },
      {
        path: "/modify",
        name: "Modify",
        component: Home,
      },
    ],
  },
];
