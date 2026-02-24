import { defineConfig } from 'umi';

export default defineConfig({
  title: '前端知识点笔记',
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index', exact: true },
        { path: '/javascript', component: '@/pages/javascript/index' },
        { path: '/css', component: '@/pages/css/index' },
        { path: '/react', component: '@/pages/react/index' },
        { path: '/performance', component: '@/pages/performance/index' },
        { path: '/browser', component: '@/pages/browser/index' },
        { path: '/network', component: '@/pages/network/index' },
      ],
    },
  ],
  npmClient: 'npm',
});
