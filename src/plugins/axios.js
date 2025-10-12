/**
 * <pre>
 *  Axios_ 비동기 요청/응답 처리 + CSRF
 *  JSP의 <security:csrfMetaTags /> 또는 CSRF-Token을 지원
 * </pre>
 * 
 * < 개정이력 >
 * 
 *  수정일			수정자			수정내용
 *  =================================================
 *  2025-10-01		KCY				최초 생성
 *  2025-10-02      KCY             CSRF 골격 형성
 * </개정이력>
 */
"use strict";

// eslint-disable-next-line no-unused-vars
import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/** axios instance의 기본 설정 */
let config = {
    baseURL: process.env.VUE_APP_API_BASE_URL || "/study-vue"
    // , withCredentials: true
    // , xsrfCookieName: 'XSRF-TOKEN'      //<== Spring Security 기본 쿠키명
    // , xsrfHeaderName: 'X-XSRF-TOKEN'    //<== Spring Security 기본 헤더명
    // , timeout: 60 * 1000,
};

const instance = axios.create(config);

/** Request Interceptor: CSRF 토큰 주입 */
instance.interceptors.request.use(
    config => {
        const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const headerName = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content') || 'X-CSRF-TOKEN';
        if(token) config.headers[headerName] = token;
        return config;
    },
    error => Promise.reject(error)
);

/** Request Interceptor: 공통 에러 처리 */
instance.interceptors.response.use(
    response => response,
    error => {
        // 예: 401 공통 처리
        if (error.response?.status === 401) {
            console.warn("인증 실패: 로그인 세션이 만료되었을 수 있습니다.");
            // TODO: 공통 처리 → 라우터 이동/알림
        }
        return Promise.reject(error);
    }
);

/** Vue 플러그인 export */
export default {
    install(app) {
        // Optional API: this.$axios
        app.config.globalProperties.$axios = instance;

        // Composition API: inject("axios")
        app.provide("axios", instance);
    }
}
/**
 *  1001_export default 부분을 수정한 이유
 *  
 *  - Vue2 => Vue.use(Plugin)로 등록 후, 내부에서 Vue.prototype.$axios = _axios로 확장해가는 방식
 *  - Vue3 => app.config.globalProperties를 써야 하게 바뀜.
 *  
 *  그럼 main.js는?
 *  
 */
// // eslint-disable-next-line no-unused-vars
// Plugin.install = function(Vue, options) {
//     Vue.axios = _axios;
//     window.axios = _axios;
//     Object.defineProperties(Vue.prototype, {
//         axios: {
//             get() {
//                 return _axios;
//             }
//         },
//         $axios: {
//             get() {
//                 return _axios;
//             }
//         },
//     });
// };
//
// Vue.use(Plugin)
//
// export default Plugin;