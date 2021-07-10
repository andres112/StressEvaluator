import store from "@/store/index.js";
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
          store
            .dispatch("presenter/getEvaluation", to.params.test_id)
            .then((res) => {
              if (res.status === 200) next();
              else next("/");
            })
            .catch((err) => {
              console.error(err);
              next("/");
            });
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
