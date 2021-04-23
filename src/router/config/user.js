import UserList from '@/components/sites/user/list.vue'
import UserDetail from '@/components/sites/user/detail.vue'
import EditUserDetail from '@/components/sites/user/detail-edit.vue'
import ChangePassword from '@/components/sites/user/changepassword'

const routeConfig = [
  {
    path: '/user',
    name: 'UserList',
    component: UserList,
  },
  {
    path: '/user/:userId',
    name: 'UserDetail',
    component: UserDetail,
    props: true,  // props 表示 userId 参数可以传到组件
  },
  {
    path: '/user/:userId/edit',
    name: 'EditUserDetail',
    component: EditUserDetail,
    props: true,  // props 表示 userId 参数可以传到组件
  },
  {
    path: '/user/:userId/changepassword',
    name: 'ChangePassword',
    component: ChangePassword,
    props: true,  // props 表示 userId 参数可以传到组件
  }
];

export default routeConfig;