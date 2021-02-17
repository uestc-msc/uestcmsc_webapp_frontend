import Home from '@/views/Home.vue'
import UserList from '@/components/sites/user/list.vue'
import UserDetail from '@/components/sites/user/detail.vue'

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
  }
];

export default routeConfig;