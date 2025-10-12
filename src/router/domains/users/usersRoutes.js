/**
 * <pre>
 *  
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-02		KCY				최초 생성
 */
export default [
  {
    path: 'cmmn/user/list',
    name: 'users',
    component: () => import('@/views/users/UserListView.vue'),
    meta: { title: '사용자 목록' }
  },
  {
    path: 'cmmn/user/detail',
    name: 'user-detail',
    component: () => import('@/views/users/UserDetailView.vue'),
    meta: { title: '사용자 상세' }
  },
  {
    path: 'cmmn/user/insert',
    name: 'user-create',
    component: () => import('@/views/users/UserInsertView.vue'),
    meta: { title: '사용자 등록' }
  },
  {
    path: 'cmmn/user/update',
    name: 'user-edit',
    component: () => import('@/views/users/UserUpdateView.vue'),
    meta: { title: '사용자 수정' }
  }
]
