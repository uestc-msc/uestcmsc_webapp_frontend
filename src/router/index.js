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

// 检查是否满足路由条件
// 由于只靠路由、不靠活动信息，只能做简单的鉴权
// 故统一为在页面内做鉴权
// router.beforeEach((to, from, next) => {
//   window.to.push(to);
//   console.log('try to goto', to);
//   for (let routeRecord of to.matched) {
//     if (routeRecord.meta.permission) {
//       let permitted = routeRecord.meta.permission();
//       console.assert(typeof permitted === 'boolean');
//       if (!permitted) {
//         if (store.getters.isNotAuthenticated) {
//           console.log('router forbidden');
//           store.commit('setMsg', '请先登录~')
//           gotoLogin();
//         }
//         else {
//           goHome();
//         }
//         return;
//       }
//     }
//   }
//   console.log('success');
//   next();
//   store.commit('setAppbarLoading', false);
// });

export default router;
