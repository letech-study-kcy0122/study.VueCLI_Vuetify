<!--
 * <pre>
 *  상태(rail, drawer) 를 갖고 있는 레이아웃
 *  tiles-layout.jsp를 대체하기 위한 컴포넌트.
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-02		KCY				최초 생성
-->
<template>
  <v-layout class="h-screen">
    <!-- :rail="rail"로 바인딩 값을 내려줌 => AppLeft.vue로 넘어감 -->
    <v-navigation-drawer v-model="drawer" :rail="rail" :permanent="true">
      <AppLeft :rail="rail" @toggle-rail="rail = !rail" />
    </v-navigation-drawer>

    <v-main>
      <v-app-bar flat density="comfortable">
        <AppHeader :title="route.meta.title ?? 'Untitled'" @toggle-drawer="drawer = !drawer" />
      </v-app-bar>

      <div class="page-content">
        <router-view />
      </div>

      <v-footer app>
        <AppFooter />
      </v-footer>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/app/AppHeader.vue'
import AppLeft from '@/components/app/AppLeft.vue'
import AppFooter from '@/components/app/AppFooter.vue'

const route = useRoute()
const drawer = ref(true)
const rail = ref(false)
</script>

<style scoped>
.page-content {
  height: calc(100vh - 64px - 48px);
  overflow-y: auto;
  padding: 12px;
}
</style>