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
 *                                  Vuetify, Axios, Router 적용
 *  2025-10-02      KCY             Pinia 적용
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axiosPlugin from './plugins/axios';
import vuetify from './plugins/vuetify';
//import './styles/global.scss';

createApp(App)
    .use(router)
    .use(axiosPlugin)
    .use(vuetify)
    .use(createPinia())
    .mount('#app')

/**
 * 컴포넌트에서 쓰는 방법
 * 
 * # Options API (Vue2 기존 방식)
 * export default {
 *    mounted() {
 *      this.$axios.get("/user-management/users").then(() => { ... })
 *    }
 * }
 * 
 * # Composition API (Vue3 추가된 방식)
 * export default {
 *    setup() {
 *      const axios = inject("axios");
 *      onMounted(async () => {
 *        const {data} = await axios.get("/user-management/users")
 *      });
 *    }
 * }
 * 
 */