import {RouteConfig} from 'vue-router/types/router'
import Login from '@/components/sites/account/login.vue'
import SignUp from '@/components/sites/account/signup.vue'
import ResetPassword from '@/components/sites/account/resetpassword.vue'
import ForgetPassword from '@/components/sites/account/forgetpassword.vue'

const routeConfig: RouteConfig[] = [
  {
    path: '/signup',
    name: 'SignUp',
    // component: SignUp
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/forgetpassword',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword
  }
];

export default routeConfig;