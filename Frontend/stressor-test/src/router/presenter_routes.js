import store from "@/store/index.js";
import Home from "@/views/Presenter/Home.vue";
import Evaluation from "@/views/Presenter/Evaluation.vue";
import Introduction from "@/views/Presenter/Introduction.vue";
import Acknowledge from "@/views/Presenter/Acknowledge.vue";

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
        component: Home,
      },
      {
        path: "/presenter/:test_id",
        name: "Introduction",
        component: Introduction,
        beforeEnter: (to, from, next) => {
          store
            .dispatch("presenter/getEvaluation", to.params.test_id)
            .then((res) => {
              if (res?._id && res.published) next();
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
        beforeEnter: (to, from, next) => {
          if (from.name == "Introduction") next();
          else if (from.name == "Acknowledge") next(from.path)
          else next("/");
        },
      },
      {
        path: "/acknowledge",
        name: "Acknowledge",
        component: Acknowledge,
      },
      // Not found page
      {
        path: "*",
        component: Home,
        beforeEnter: (to, from, next) => {
          next("/");
        },
      },
    ],
  },
];
