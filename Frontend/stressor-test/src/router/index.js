import Vue from "vue";
import VueRouter from "vue-router";
import { e_routes } from "@/router/evaluator_routes";

Vue.use(VueRouter);

const routes = [...e_routes];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
