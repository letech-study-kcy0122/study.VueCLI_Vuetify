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
  <div class="w-100 d-flex align-center">
    <v-btn icon variant="text" @click="$emit('toggle-drawer')">
      <v-icon icon="mdi:mdi-menu" />
    </v-btn>
    <div class="text-h6 ml-2">{{ title }}</div>
    <div class="ml-auto d-flex align-center ga-2">
      <v-btn icon variant="text"><v-icon icon="mdi:mdi-bell-outline" /></v-btn>
      <v-avatar size="32"><img alt="me" src="https://i.pravatar.cc/32" /></v-avatar>
    </div>
  </div>
</template>
<script setup>
/* 
 *  ESLint가 멍청하게도, 전역변수인 defineProps를 없는변수 취급하는 중.
 *  <script setup /> 안의 defineProps, defineEmits, defineExpose 등의 일부 변수는
 *  Vue Compiler가 빌드 시 알아서 변환해준다.
 * 
 *  ==> package.json 안에서 global KEY값 추가해줌.(1002_)
 */
defineProps({ title: { type: String, default: '' } })
</script>