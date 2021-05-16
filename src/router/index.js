import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

import userRouteConfig from "./config/user";
import accountRouteConfig from "./config/account";
import activityRouteConfig from "./config/activity";
import galleryRouteConfig from "./config/gallery";
import cloudRouteConfig from "./config/cloud";
import debugRouteConfig from "./config/debug";
import notFound from '@/components/sites/404.vue';
import {goHome, gotoLogin} from '@/utils/router';

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect: {name: 'ActivityList'}
  },
  ...userRouteConfig,
  ...accountRouteConfig,
  ...activityRouteConfig,
  ...galleryRouteConfig,
  ...cloudRouteConfig,
  ...debugRouteConfig,
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
});

export default router;
