/**
 * <pre>
 *  Pinia: 레이아웃 상태 관리 라이브러리.
 * 
 *  **src/stores/layout.js**
 *  Layout 전용 상태: drawer, theme
 * 
 *  **src/stores/index.js**
 *  글로벌 초기화용(Pinia를 main.js에서 불러다 쓰게 해줌.)
 * 
 *  - 컴포넌트 사용 예시
 *  ```vue
 *      <script setup>
 *      import { useLayoutStore } from '@/stores/layout'
 *      
 *      const layout = useLayoutStore()
 *      </script>
 *      
 *      <template>
 *        <v-navigation-drawer v-model="layout.drawer" />
 *        <v-btn @click="layout.toggleDrawer()">Toggle Drawer</v-btn>
 *      </template>
 *  ```
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-01		KCY				최초 생성
 * </개정이력>
 */
import { defineStore } from 'pinia'
export const useLayoutStore = defineStore('layout', {
  state: () => ({
    drawer: true,
    theme: 'light'
  }),
  actions: {
    toggleDrawer() { this.drawer = !this.drawer }
  }
})