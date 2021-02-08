import {RouteConfig} from 'vue-router/types/router'
import Home from '@/views/Home.vue'

const routeConfig: RouteConfig[] = [
  {
    path: '/gallery',
    name: 'GalleryList',
    component: Home,
  }
];

export default routeConfig;