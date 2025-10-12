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
 *                                  프록시 설정
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: ['vuetify'], //true

    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    /**
     *  Vue CLI는 webpack-dev-server를 감싼 껍데기.
     *  해당 서버의 옵션 키값이 devServer로 아예 정해져있음.
     * 
     *  환경 구분하는 방법:: 환경파일(.env) 사용
     *  - 모두 앞에 VUE_APP_ prefix가 붙어야 함.
     */
    devServer: {
        port: 8082,
        proxy: {
            '/study-vue': {
                target: 'http://localhost:8081', // BACK-END SERVER (REST-API)
                changeOrigin: true,
                pathRewrite: { '^/study-vue': '' }
            }
        },
    },

    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    }
})