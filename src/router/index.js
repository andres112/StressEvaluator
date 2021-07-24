import Vue from "vue";
import VueRouter from "vue-router";
import { b_routes } from "@/router/builder_routes";
import { p_routes } from "@/router/presenter_routes";

Vue.use(VueRouter);

const routes = [...b_routes, ...p_routes];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
