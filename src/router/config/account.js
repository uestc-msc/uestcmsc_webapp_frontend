import Login from '@/components/sites/account/login.vue'
import Signup from '@/components/sites/account/signup.vue'
import Logout from '@/components/sites/account/logout.vue'
import ResetPassword from '@/components/sites/account/resetpassword.vue'
import ForgetPassword from '@/components/sites/account/forgetpassword.vue'

const routeConfig = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
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