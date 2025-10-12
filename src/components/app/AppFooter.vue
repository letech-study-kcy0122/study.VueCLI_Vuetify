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
  <div class="w-100 d-flex justify-space-between px-3 py-2">
    <small>&copy; {{ year }} StudyVue</small>
    <small>v3.0.0 + Vue 3.2.13</small>
  </div>
</template>
<script setup>
const year = new Date().getFullYear()
</script>