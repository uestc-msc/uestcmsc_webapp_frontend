import Home from '@/views/Home.vue'

const routeConfig = [
  {
    path: '/activity',
    name: 'ActivityList',
    component: Home
  },
  {
    path: '/activity/create',
    name: 'CreateActivity',
    component: Home,
  },
  {
    path: '/activity/:activityId',
    name: 'ActivityDetail',
    component: Home,
    props: true
  },
  {
    path: '/activity/:activityId/update',
    name: 'UpdateActivity',
    component: Home,
    props: true
  },
  {
    path: '/activity/checkin',
    name: 'ActivityCheckIn',
    component: Home
  }
];

export default routeConfig;