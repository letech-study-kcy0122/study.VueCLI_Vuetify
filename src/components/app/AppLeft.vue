<!--
 * <pre>
 * 
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-02		KCY				최초 생성
-->
<template>
  <v-list density="compact" nav>
    <v-list-item>
      <div class="d-flex align-center ga-2">
        <v-btn icon variant="text" @click="$emit('toggle-rail')">
          <v-icon icon="mdi:mdi-arrow-left-right" />
        </v-btn>
        <span v-if="!rail" class="text-subtitle-2">Menu</span>
      </div>
    </v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list-item v-for="item in items" :key="item.to" :to="item.to" link>
      <template #prepend>
        <v-icon :icon="item.icon" />
      </template>
      <v-list-item-title v-if="!rail">{{ item.text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script setup>
/* 
 *  <template/>에 보면 rail이라는 prop 하나가 쓰이고 있음.
 *  이건 사이드바를 축소(rail)상태로 쓸건지, 일반상태로 펼칠건지를 구분함.
 * 
 *  App.vue로부터 props로 내려받아 사용하게 되는 형태.
 */
// eslint-disable-next-line no-unused-vars
const props = defineProps({ rail: { type: Boolean, default: false } })
const items = [
  { to: { name: 'dashboard' }, text: 'Dashboard', icon: 'mdi:mdi-view-dashboard-outline' },
  { to: { name: 'users' },     text: 'User Managements',     icon: 'mdi:mdi-account-group-outline' },
  { to: { name: 'board' },  text: 'Board',  icon: 'mdi:mdi-cog-outline' }
]
</script>