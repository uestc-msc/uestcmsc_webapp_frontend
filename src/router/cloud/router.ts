import {RouteConfig} from 'vue-router/types/router'
import {cloudComponent, cloudAdminComponent} from '@/components/sites/cloud/app'

const routeConfig: RouteConfig[] = [
  {
    path: '/cloud',
    name: 'Cloud',
    component: cloudComponent,
  },
  {
    path: '/cloud-admin',
    name: 'CloudAdmin',
    component: cloudAdminComponent,
  }
];

export default routeConfig;