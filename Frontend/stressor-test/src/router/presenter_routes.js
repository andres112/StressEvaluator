import HomePresenter from "@/views/Presenter/Home.vue";
import Evaluation from "@/views/Presenter/Evaluation.vue";

export const p_routes = [
  {
    path: "/",
    component: {
      render(c) {
        return c("router-view");
      },
    },
    children: [
      {
        path: "/",
        name: "HomePresenter",
        component: HomePresenter,
      },
      {
        path: "/presenter/:test_id",
        name: "Evaluation",
        component: Evaluation,
        beforeEnter: (to, from, next) => {
          // TODO: Create user session
          console.log(to);
          next();
        },
      },
      // Not found page
      {
        path: "*",
        component: HomePresenter,
      },
    ],
  },
];
