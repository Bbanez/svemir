import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: `/mind-snake`,
    name: 'Mind snake',
    component: () =>
      import(
        /* webpackChunkName: "mind-snake" */ '../views/mind-snake.vue'
      ),
  },
  {
    path: `/faded`,
    name: 'FadedHome',
    component: () =>
      import(
        /* webpackChunkName: "faded-home" */ '../faded/home.vue'
      ),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
