import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import userRouteConfig from "./user/router";
import accountRouteConfig from "./account/router";
import activityRouteConfig from "./activity/router";
import galleryRouteConfig from "./gallery/router";
import cloudRouteConfig from "./cloud/router";
import notFound from '@/components/sites/404.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: {name: 'ActivityList'}
  },
  ...userRouteConfig,
  ...accountRouteConfig,
  ...activityRouteConfig,
  ...galleryRouteConfig,
  ...cloudRouteConfig,
  {
    path: '*',
    name: '404',
    component: notFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
