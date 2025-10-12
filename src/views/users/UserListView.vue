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
 *  2025-10-04      KCY             템플릿 작성
 *  2025-10-08      KCY             스크립트 작성
-->
<template>
  <v-container fluid>
    <v-card class="card-shadow-sm">
      <v-card-title class="d-flex align-center py-3">
        <!-- <div class="text-h6">사용자 관리</div> -->
        <v-spacer />
        <v-btn variant="outlined" color="error" size="small" @click="bulkDelete" :disabled="selected.length === 0">
          일괄삭제
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-0">
        <!-- 검색 영역 -->
        <v-row class="mb-2">
          <v-col cols="12" sm="4">
            <v-select
              v-model="searchKey"
              :items="searchKeyItems"
              item-title="label"
              item-value="value"
              label="검색 구분"
              density="comfortable"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="searchTerm"
              label="검색어 입력"
              density="comfortable"
              variant="outlined"
              hide-details
              @keyup.enter="onSearch"
            >
              <template #append>
                <v-btn size="small" @click="onSearch">검색</v-btn>
                <v-btn size="small" variant="outlined" class="ml-2" @click="onReset">검색초기화</v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- 목록 테이블 -->
        <v-data-table
          :headers="headers"
          :items="rows"
          item-key="userId"
          :loading="loading"
          hover
          show-select
          v-model="selected"
          class="elevation-0"
          :no-data-text="'검색 결과가 없습니다.'"
        >
          <!-- dotted-slot 대신 단일 item 슬롯으로 전체 행 렌더링 (eslint/valid-v-slot 우회) -->
          <template #item="{ item, index }">
            <tr class="row-hover">
              <td></td>
              <td style="width:72px;">{{ index + 1 }}</td>
              <td>
                <RouterLink
                  :to="{ name: 'user-detail', /*params: { id: item.userId }*/ query: {userId: item.userId} }"
                  class="text-primary text-decoration-none"
                >
                  {{ item.userId }}
                </RouterLink>
              </td>
              <td>{{ item.userNm }}</td>
              <td class="user-rgst-datetime">{{ formatKstToMonthDayTime(item.rgstDt) }}</td>
              <td style="width:120px;">
                <v-btn size="x-small" variant="text" @click="goDetail(item.userId)">상세</v-btn>
              </td>
            </tr>
          </template>

          <template #loading>
            <div class="pa-6">불러오는 중...</div>
          </template>
        </v-data-table>

        <!-- 하단 버튼 -->
        <div class="d-flex justify-end mt-3">
          <v-btn variant="outlined" color="error" size="small" @click="bulkDelete" :disabled="selected.length === 0">
            일괄삭제
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
/**
 * 변환 포인트
 * - 라우터 쿼리: key, term (JSP 호환 유지)
 * - 백엔드 API 파라미터: keyword, term  ← 8081 RESTUserController 기준
 * - 날짜 포맷: "Tue Sep 23 13:02:25 KST 2025" → "09-23 13:02"
 * - jQuery/DOM 직접 접근, onclick 네비게이션 전부 제거
 */
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const axios = inject('axios')
const route = useRoute()
const router = useRouter()

// 검색 구분: JSP의 0=전체, 1=아이디, 2=이름
const searchKeyItems = [
  { label: '--전체--', value: '0' },
  { label: '아이디', value: '1' },
  { label: '이름', value: '2' }
]

const searchKey = ref(String(route.query.key ?? '0'))
const searchTerm = ref(String(route.query.term ?? ''))

const loading = ref(false)
const rows = ref([])
// 선택된 행들 (일괄삭제 대비)
const selected = ref([])

const headers = [
  { title: 'no', value: 'no', sortable: false, width: 72 },
  { title: '사용자 아이디', value: 'userId' },
  { title: '사용자 이름', value: 'userNm' },
  { title: '등록일자', value: 'rgstDt' },
  { title: '비고', value: '_actions', sortable: false, width: 120 }
]

// JSP 포맷 → "MM-dd HH:mm" 변환
function formatKstToMonthDayTime(str) {
  if (!str || typeof str !== 'string') return ''
  const parts = str.trim().split(/\s+/)
  if (parts.length < 6) return str
  const monthMap = { Jan:'01', Feb:'02', Mar:'03', Apr:'04', May:'05', Jun:'06', Jul:'07', Aug:'08', Sep:'09', Oct:'10', Nov:'11', Dec:'12' }
  const month = monthMap[parts[1]]
  const day = String(parts[2]).padStart(2, '0')
  const [hh, mm] = String(parts[3]).split(':')
  if (!month || !hh || !mm) return str
  return `${month}-${day} ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// 라우터 쿼리 동기화 (JSP와 동일 키 유지)
function syncQuery() {
  router.replace({
    query: {
      key: searchKey.value !== '0' ? searchKey.value : undefined,
      term: searchTerm.value || undefined
    }
  })
}

// 실제 목록 조회
async function fetchList() {
  loading.value = true
  try {
    syncQuery()
    // 8081 컨트롤러는 keyword 파라미터를 받음
    const { data } = await axios.get('/user-management/users', {
      params: {
        keyword: Number(searchKey.value),     // ← 여기 중요
        term: searchTerm.value || 'default'
      }
    })
    // Envelope 형태 가정 { data: [...] } or { content: [...] }
    rows.value = Array.isArray(data?.data) ? data.data
                : Array.isArray(data?.content) ? data.content
                : Array.isArray(data) ? data
                : []
  } finally {
    loading.value = false
  }
}

function onSearch() {
  fetchList()
}

function onReset() {
  searchKey.value = '0'
  searchTerm.value = ''
  fetchList()
}

function goDetail(userId) {
  router.push({ name: 'user-detail', /*params: { id: userId }*/ query: {userId} })
}

async function bulkDelete() {
  if (!selected.value.length) return
  // TODO: 일괄삭제 API 규약 맞춰 구현
  // const ids = selected.value.map(v => v.userId)
  // await axios.post('/user-management/users/bulk-delete', ids)
  // await fetchList()
  console.debug('bulkDelete selected:', selected.value.map(v => v.userId))
}

onMounted(fetchList)

// 브라우저 뒤/앞 탐색 시 쿼리 반영
watch(() => route.query, q => {
  searchKey.value = String(q.key ?? '0')
  searchTerm.value = String(q.term ?? '')
  fetchList()
})
</script>

<style scoped>
.card-shadow-sm { box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.text-decoration-none { text-decoration: none; }

/* 홀짝 배경이 꼭 필요하면 CSS로 처리. JS로 DOM에 클래스 뿌리던 관행은 그만. */
.row-hover:nth-child(odd)  { background: rgba(0,0,0,0.02); }
.row-hover:nth-child(even) { background: transparent; }
</style>
