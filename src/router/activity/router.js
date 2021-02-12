import Home from '@/views/Home.vue'

const routeConfig = [
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
            path: 'change',
            name: 'UpdateActivity',
            component: Home,
            props: true,
            children: [
              {
                path: 'presenter',
                name: 'UpdateActivityPresenter',
                component: Home,
                props: true
              },
              {
                path: 'attender',
                name: 'UpdateActivityAttender',
                component: Home,
                props: true
              }
            ]
          },
          {
            path: 'checkin',
            name: 'ActivityCheckIn',
            component: Home
          }
        ]
      }
    ]
  },
];

export default routeConfig;