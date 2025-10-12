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
 *  2025-10-05      KCY             사용자 등록페이지 이동요소 추가
-->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Stats</v-card-title>
          <v-card-text>Replace those old ApexCharts scripts with vue3-apexcharts later.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Recent</v-card-title>
          <v-card-text>Content goes here.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <RouterLink
          :to="{ name: 'user-create' }"
          class="text-primary text-decoration-none"
        >
        <v-card>
          <v-card-title>Sign-up</v-card-title>
          <v-card-text>Create New User here.</v-card-text>
        </v-card>
        </RouterLink>
      </v-col>
    </v-row>
  </v-container>
</template>
