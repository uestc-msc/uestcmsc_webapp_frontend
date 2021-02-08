import {RouteConfig} from 'vue-router/types/router'
import Home from '@/views/Home.vue'

const routeConfig: RouteConfig[] = [
  {
    path: '/user',
    name: 'UserList',
    component: Home,
    children: [
      {
        path: ':userId',
        name: 'UserDetail',
        component: Home,
        props: true,
        children: [
          {
            path: 'change',
            name: 'UpdateUser',
            component: Home,
            props: true,
          },
        ]
      }
    ]
  },
];

export default routeConfig;