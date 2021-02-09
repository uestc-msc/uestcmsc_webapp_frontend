import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import userRouteConfig from "./user/router";
import accountRouteConfig from "./account/router";
import activityRouteConfig from "./activity/router";
import galleryRouteConfig from "./gallery/router";
import cloudRouteConfig from "./cloud/router";
import notFound from '@/components/sites/404.vue'
import { goBack } from '@/utils/router';

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

// 检查是否满足路由条件
router.beforeEach((to, from, next) => {
  for (let i = 0; i < to.matched.length; i++)
  {
    let routeRecord = to.matched[i];
    if (routeRecord.meta.need !== undefined) {
      for (let j = 0; j < routeRecord.meta.need.length; j++) {
        let permissionFunction = routeRecord.meta.need[j];      
        if (!permissionFunction()) {
          goBack();
          return;
        }
      }
    }
  }
  next();
});

export default router
