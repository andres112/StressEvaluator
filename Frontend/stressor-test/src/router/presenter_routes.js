import store from "@/store/index.js";
import Home from "@/views/Presenter/Home.vue";
import Evaluation from "@/views/Presenter/Evaluation.vue";
import Introduction from "@/views/Presenter/Introduction.vue";

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
        name: "Home",
        component: Home,
      },
      {
        path: "/presenter/:test_id",
        name: "Introduction",
        component: Introduction,
        beforeEnter: (to, from, next) => {
          //FIXME: Here just retrieve the evaluation
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
      {
        path: "/presenter/:test_id/session/:session_id",
        name: "Evaluation",
        component: Evaluation,
      },
      // Not found page
      {
        path: "*",
        component: Home,
      },
    ],
  },
];
