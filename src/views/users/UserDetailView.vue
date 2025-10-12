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
 *  2025-10-05      KCY             템플릿 작성
 *  2025-10-08      KCY             스크립트 작성
-->
<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        <!-- <div class="text-h6">사용자 상세 조회</div> -->
        <v-spacer />
        <v-btn size="small" variant="text" @click="goList">목록</v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorMsg"
        />
        <v-skeleton-loader v-if="loading" type="table" />

        <template v-else>
          <v-table density="comfortable" class="mb-2">
            <thead>
              <tr>
                <th colspan="2" class="text-center">회원 정보</th>
              </tr>
            </thead>
            <tbody>
              <!-- 프로필 이미지는 사용하지 않음 (요청사항) -->
              <tr>
                <th class="text-right text-no-wrap" style="width: 180px;">사용자 ID</th>
                <td><strong>{{ user?.userId }}</strong></td>
              </tr>
              <tr>
                <th class="text-right text-no-wrap">사용자 이름</th>
                <td><strong>{{ user?.userNm }}</strong></td>
              </tr>
              <tr>
                <th class="text-right text-no-wrap">사용자 주민번호</th>
                <td>
                  <strong v-if="user?.regno1 && user?.regno2">
                    {{ user.regno1 }}-{{ user.regno2 }}
                  </strong>
                </td>
              </tr>
              <tr>
                <th class="text-right text-no-wrap">사용자 권한</th>
                <td>
                  <template v-if="roleNames.length">
                    <strong>
                      {{ roleNames.join(' / ') }}
                    </strong>
                  </template>
                  <span v-else class="text-medium-emphasis">권한 정보 없음</span>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="d-flex ga-2">
            <v-btn color="primary" @click="goEdit" size="small">수정</v-btn>
            <v-btn color="error" variant="outlined" @click="remove" size="small">삭제</v-btn>
            <v-spacer />
            <v-btn variant="text" @click="goList" size="small">목록</v-btn>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
/**
 * 요청/응답 규약
 * - 사용자 상세: GET /user-management/users/{userId} → Envelope<UserVO> { data: {...} }
 * - 사용자 권한: GET /cmmn-management/user-role/{userId} → Envelope<List<UserRoleVO>> { data: [...] }
 * - 공통 코드:   GET /cmmn-management/code/AA → Envelope<List<CommonCodeVO>> { data: [...] }
 *
 * 주의: 프로필 이미지는 불러오지 않음.
 * 삭제 API는 명세가 없어서 호출부만 TODO로 남김.
 */
import { inject, onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const axios = inject('axios')
const route = useRoute()
const router = useRouter()

const user = ref(null)
const userRoles = ref([])         // [{ userRole: 'ROLE_ADMIN', ... }]
const cmmnCodeList = ref([])      // [{ cmmnCd: 'ROLE_ADMIN', cmmnNm: '관리자', ... }]
const loading = ref(false)
const errorMsg = ref('')

const roleNames = computed(() => {
  if (!userRoles.value?.length || !cmmnCodeList.value?.length) return []
  const codeMap = new Map(cmmnCodeList.value.map(c => [c.cmmnCd, c.cmmnNm]))
  return userRoles.value
    .map(r => codeMap.get(r.userRole))
    .filter(Boolean)
})

function getUserId() {
  return route.query.userId ?? route.params.userId ?? route.params.id
}

async function load() {
  errorMsg.value = ''
  loading.value = true
  try {
    const userId = /*route.params.id*/ getUserId();
    if (!userId) { errorMsg.value = 'userId가 없습니다.'; return }
    console.debug("route.params.id: ", userId);
    // 병렬 호출
    const [userRes, rolesRes, codeRes] = await Promise.all([
      axios.get(`/user-management/users/${userId}`),
      axios.get(`/cmmn-management/user-role/${userId}`),
      axios.get(`/cmmn-management/code/AA`)
    ])

    // Envelope 형태 대응
    user.value = userRes.data?.data ?? userRes.data ?? null
    userRoles.value = rolesRes.data?.data ?? rolesRes.data ?? []
    cmmnCodeList.value = codeRes.data?.data ?? codeRes.data ?? []
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || '상세 정보를 불러오는 중 오류가 발생했습니다.'
    // 개발 편의용 로깅
    // eslint-disable-next-line no-console
    console.error('DETAIL_LOAD_ERR', {
      msg: e.message,
      status: e.response?.status,
      data: e.response?.data
    })
  } finally {
    loading.value = false
  }
}

// 라우트가 바뀌면 다시 로드 (뒤로가기/앞으로가기 포함)
watch(
  () => [route.query.userId, route.params.id, route.params.userId],
  () => load()
)

function goEdit() {
  // 라우터에 편의상 user-edit 라우트가 있다고 가정
  const userId = route.query.userId ?? route.params.userId ?? route.params.id;
  router.push({ name: 'user-edit', query: { userId } });
}
function goList() {
  // 기존 JSP가 /cmmn/user/list 로 이동했으므로 라우트 네임 'users' 사용
  router.push({ name: 'users' })
}
async function remove() {
  // TODO: 삭제 API 명세 확인 후 수정.
  // 보통: await axios.delete(`/user-management/users/${route.params.id}`)
  // await router.replace({ name: 'users' })
  // 지금은 안전하게 콘솔만
  // eslint-disable-next-line no-console
  console.debug('DELETE requested for', route.params.id)
}

onMounted(load)
</script>

<style scoped>
.text-right { text-align: right; }
</style>
