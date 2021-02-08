import {RouteConfig} from 'vue-router/types/router'
import Home from '@/views/Home.vue'

const routeConfig: RouteConfig[] = [
  {
    path: '/signup',
    name: 'SignUp',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Home
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Home
  },
  {
    path: '/accounts',
    children: [
      {
        path: '/forgetpassword',
        name: 'ForgetPassword',
        component: Home
      },
      {
        path: '/resetpassword',
        name: 'ResetPassword',
        component: Home
      }
    ]
  },
];

export default routeConfig;