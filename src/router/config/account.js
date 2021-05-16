import Login from '@/components/sites/account/login.vue';
import Signup from '@/components/sites/account/signup.vue';
import Logout from '@/components/sites/account/logout.vue';
import ResetPassword from '@/components/sites/account/resetpassword.vue';
import ForgetPassword from '@/components/sites/account/forgetpassword.vue';
import store from '@/store';

const getters = store.getters;

const routeConfig = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      permission: () => getters.isNotAuthenticated,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      permission: () => getters.isNotAuthenticated,
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      permission: () => getters.isAuthenticated,
    },
  },
  {
    path: '/forgetpassword',
    name: 'ForgetPassword',
    component: ForgetPassword,
    meta: {
      permission: () => getters.isNotAuthenticated,
    },
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      permission: () => getters.isNotAuthenticated,
    },
  }
];

export default routeConfig;