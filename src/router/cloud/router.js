import {cloudComponent, cloudAdminComponent} from '@/components/sites/cloud/app'

const routeConfig = [
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