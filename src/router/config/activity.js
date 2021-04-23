import notFound from '@/components/sites/404.vue'

const routeConfig = [
  {
    path: '/activity',
    name: 'ActivityList',
    component: notFound
  },
  {
    path: '/activity/create',
    name: 'CreateActivity',
    component: notFound,
  },
  {
    path: '/activity/:activityId',
    name: 'ActivityDetail',
    component: notFound,
    props: true,  // props 表示 userId 参数可以传到组件
  },
  {
    path: '/activity/:activityId/update',
    name: 'UpdateActivity',
    component: notFound,
    props: true,  // props 表示 userId 参数可以传到组件
  },
  {
    path: '/activity/checkin',
    name: 'ActivityCheckIn',
    component: notFound
  }
];

export default routeConfig;