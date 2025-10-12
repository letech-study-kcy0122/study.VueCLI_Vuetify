# Vue + Vuetify 프로젝트 설정 요약

```
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
 *  2025-10-03		KCY				수정
 *  2025-10-12      KCY             수정
 */
```

## ⚙️ 프로젝트 구조 개요

- **빌드 시스템**: Vue CLI 5.x (`vue-cli-service serve/build/lint`)
- **Vue 버전**: 3.2.13
- **Vuetify 버전**: 3.0.0-beta.0 (정식 이전 버전)
- **라우터**: Vue Router 4.0.3
- **상태 관리**: Pinia 2.1.4
- **HTTP 통신**: Axios 0.18.0 (구버전이라 interceptors 등 일부 옵션 제한됨)

## 🧱 주요 종속성

| 구분      | 패키지            | 버전          | 비고                              |
| ---       | ---               | ---           | ---                               |
| UI        | `vuetify`         | 3.0.0-beta.0  | Vuetify 3 베타                    |
| 아이콘    | `@mdi/font`       | 5.9.55        | Material Design Icons             |
| 폰트      | `roboto-fontface` | *             | Vuetify 기본 폰트                 |
| 라우터    | `vue-router`      | ^4.0.3        | Vue 3 대응 버전                   |
| 상태관리  | `pinia`           | ^2.1.4        | Vuex 대체, Composition API 기반   |
| HTTP      | `axios`           | ^0.18.0       | 보안/기능 측면에서 업데이트 권장  |
| 빌드도구  | `@vue/cli-service`| ~5.0.0        | Webpack 5 기반                    |

## 🧩 개발용 플러그인

- `vue-cli-plugin-vuetify` (~2.5.8): Vuetify 템플릿 및 트랜스파일러 통합용
- `webpack-plugin-vuetify` (2.0.0-alpha.0): Vuetify 로더 보조 플러그인
- `vue-cli-plugin-pinia`: Pinia 자동 설정
- `vue-cli-plugin-axios`: axios 등록 스캐폴딩용

## 🧹 ESLint 설정

- **파서**: `@babel/eslint-parser`
- **확장 규칙**: `"plugin:vue/vue3-essential"`, `"eslint:recommended"`
- **전역 매크로**: `defineProps`, `defineEmits`, `defineExpose`,
`defineOptions` → Composition API 지원을 위한 `readonly` 선언
- **Node 환경** 기본 활성화 (`env.node: true`)

## 🌐 브라우저 타겟

```
> 1%
last 2 versions
not dead
not ie 11
```

_IE11은 완전히 배제, 크롬/엣지/사파리/파이어폭스 최신 버전 중심._



# study.vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

