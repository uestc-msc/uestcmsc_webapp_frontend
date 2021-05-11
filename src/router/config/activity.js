import notFound from '@/components/sites/404.vue'
import ActivityList from '@/components/sites/activity/list'
import CreateActivity from '@/components/sites/activity/create'
import ActivityDetail from '@/components/sites/activity/detail'
import ActivityDetailEdit from '@/components/sites/activity/detail-edit/detail-edit'
import ActivityCheckIn from '@/components/sites/activity/check-in'

const routeConfig = [
  {
    path: '/activity',
    name: 'ActivityList',
    component: ActivityList
  },
  {
    path: '/activity/create',
    name: 'CreateActivity',
    component: CreateActivity,
  },
  {
    path: '/activity/:activityId',
    name: 'ActivityDetail',
    component: ActivityDetail,
    props: true,  // props 表示 activityId 参数可以传到组件
  },
  {
    path: '/activity/:activityId/edit',
    name: 'ActivityDetailEdit',
    component: ActivityDetailEdit,
    props: true,  // props 表示 activityId 参数可以传到组件
  },
  {
    path: '/activity/checkin',
    name: 'ActivityCheckIn',
    component: ActivityCheckIn
  }
];

export default routeConfig;