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
 *  2025-10-13      KCY             불필요 코드 수정
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
 * REST API
 * - 사용자 상세: GET /user-management/users/{userId}       → Envelope<UserVO> { data: {...} }
 * - 사용자 권한: GET /cmmn-management/user-role/{userId}   → Envelope<List<UserRoleVO>> { data: [...] }
 * - 공통 코드:   GET /cmmn-management/code/AA              → Envelope<List<CommonCodeVO>> { data: [...] }
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
        // 디버깅
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
    const userId = route.query.userId ?? route.params.userId ?? route.params.id;
    router.push({ name: 'user-edit', query: { userId } });
}
function goList() {
    router.push({ name: 'users' })
}
async function remove() {
    const userId = /*route.params.id*/ getUserId();

    try {
        console.debug("route.params.id: ", userId);
        /*const removeRes = */await axios.delete(`/user-management/users/${userId}`)
        await router.replace({ name: 'users' })
        goList();
        // eslint-disable-next-line no-console
        console.debug('DELETE requested for', userId)
    } catch(e) {
      errorMsg.value = e?.response?.data?.message || '상세 정보를 불러오는 중 오류가 발생했습니다.'
        // 디버깅
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

onMounted(load)
</script>

<style scoped>
.text-right { text-align: right; }
</style>
