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
 *  2025-10-03      KCY             'board' 라우트 alias 추가 (posts로 redirect)
 */
export default [
  {
    path: 'board/forum/list',
    name: 'posts',
    component: () => import('@/views/board/PostListView.vue'),
    meta: { title: '자유게시글 목록' }
  },
  // ALIAS: board 라우트 복제 (->posts로 redirect)
  {
    path: 'board',
    name: 'board',
    redirect: { name: 'posts' },
    meta: { title: '자유게시글 목록 (alias)' }
  },
  {
    path: 'board/forum/post',
    name: 'post-detail',
    component: () => import("@/views/board/PostDetailView.vue"),
    meta: { title: '자유게시글 상세'}
  },
  {
    path: 'board/forum/post/insert',
    name: 'post-insert',
    component: () => import("@/views/board/PostInsertView.vue"),
    meta: { title: '자유게시글 등록' }
  },
  {
    path: 'board/forum/post/update',
    name: 'post-update',
    component: () => import("@/views/board/PostUpdateView.vue"),
    meta: { title: '자유게시글 수정' }
  }
]