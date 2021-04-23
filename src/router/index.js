import Vue from 'vue'
import VueRouter from 'vue-router'

import userRouteConfig from "./config/user";
import accountRouteConfig from "./config/account";
import activityRouteConfig from "./config/activity";
import galleryRouteConfig from "./config/gallery";
import notFound from '@/components/sites/404.vue'
import {goHome} from '@/utils/router';

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
          goHome();
          return;
        }
      }
    }
  }
  next();
});

export default router
