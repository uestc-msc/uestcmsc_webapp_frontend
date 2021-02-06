import {RouteConfig} from 'vue-router/types/router'
import Home from '@/views/Home.vue'

const routeConfig: RouteConfig[] = [
  {
    path: '/activity',
    name: 'ActivityList',
    component: Home,
    children: [
      {
        path: 'create',
        name: 'CreateActivity',
        component: Home,
        children: [
          {
            path: 'presenter',
            name: 'CreateActivityChoosePresenter',
            component: Home
          }
        ]
      },
      {
        path: ':activityId',
        name: 'ActivityDetail',
        component: Home,
        props: true,
        children: [
          {
            path: 'update',
            name: 'UpdateActivity',
            component: Home,
            props: true,
            children: [
              {
                path: 'presenter',
                name: 'UpdateActivityChoosePresenter',
                component: Home,
                props: true
              }
            ]
          },

        ]
      }
    ]
  },
];

export default routeConfig;