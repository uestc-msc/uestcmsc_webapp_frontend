import UserList from '@/components/sites/user/list.vue'
import UserDetail from '@/components/sites/user/detail.vue'
import UserDetailEdit from '@/components/sites/user/detail-edit.vue'
import store from '@/store';

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
    name: 'UserDetailEdit',
    component: UserDetailEdit,
    props: true,  // props 表示 userId 参数可以传到组件
    meta: {
      permission: () => store.getters.isSelfOrAdmin(userId),
    },
  },
];

export default routeConfig;