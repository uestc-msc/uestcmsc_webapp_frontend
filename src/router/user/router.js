import Home from '@/views/Home.vue'
import store from '@/store'

const routeConfig = [
  {
    path: '/user',
    name: 'UserList',
    component: Home,
    children: [
      {
        path: 'me',
      },
      {
        path: ':userId',
        name: 'UserDetail',
        component: Home,
        props: true,  // props 表示 userId 参数可以传到组件
        children: [
          {
            path: 'change',
            name: 'UpdateUser',
            component: Home,
            props: true,
          },
        ]
      },
    ]
  },
];

export default routeConfig;