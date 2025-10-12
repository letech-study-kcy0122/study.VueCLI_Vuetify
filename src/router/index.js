/**
 * <pre>
 *  
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-01		KCY				최초 생성
 *  2025-10-02		KCY				HomeView.vue 대신 DefaultLayout.vue 적용
 *                          사용자관리, 게시판 라우터 형성
 */
import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import usersRoutes from './domains/users/usersRoutes'
import boardRoutes from './domains/board/boardRoutes';
const routes = [
  {
    path: '/',
    name: 'defaultLayout',
    component: DefaultLayout,
    children: [
      { path: '', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: 'Dashboard' } },
      // { path: 'users/list', name: 'users', component: () => import('@/views/UsersView.vue'), meta: { title: 'Users' } },
      // { path: 'board/forum/list', name: 'board', component: () => import('@/views/SettingsView.vue'), meta: { title: 'Board' } },
      ...usersRoutes,
      ...boardRoutes

    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
