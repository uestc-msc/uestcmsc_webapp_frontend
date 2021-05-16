import CloudStatus from '@/components/sites/cloud/status'
import store from '@/store';

const routeConfig = [
  {
    path: '/cloud/status',
    name: 'CloudStatus',
    component: CloudStatus,
  }
];

export default routeConfig;