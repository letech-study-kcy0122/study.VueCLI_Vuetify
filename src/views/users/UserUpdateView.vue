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
 *  2025-10-06      KCY             템플릿 작성
 *  2025-10-11      KCY             스크립트 작성
 *  2025-10-12      KCY             form inputs 검증 UX 구현,
 *                                  비밀번호 수정 폼 구현
-->
<template>
  <v-container>
    <v-card class="shadow-sm">
      <v-card-title class="d-flex align-center">
        <!-- <div class="text-h6">사용자 정보 수정</div> -->
        <v-spacer />
        <v-btn variant="text" size="small" @click="goDetailOrList">뒤로</v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorMsg"
        />

        <v-form ref="formRef" @submit.prevent="onSubmit">
          <v-row class="w-75 mx-auto">
            <!-- 사용자 ID (읽기 전용) -->
            <v-col cols="12" md="6">
              <v-text-field
                :model-value="userId"
                label="* 사용자 ID"
                variant="outlined"
                density="comfortable"
                readonly
                disabled
              />
            </v-col>
            </v-row>
            <v-row class="w-75 mx-auto">
            <!-- 사용자 이름 -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.userNm"
                label="* 사용자 이름"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>
            </v-row>
            <v-row class="w-75 mx-auto">
            <!-- 주민번호 -->
            <v-col cols="12" md="6" class="d-flex gap-2">
              <v-text-field
                v-model="form.regno1"
                label="주민번호 앞자리"
                inputmode="numeric"
                pattern="\d*"
                maxlength="6"
                :counter="6"
                :rules="[rules.len6, rules.digits]"
                variant="outlined"
                density="comfortable"
                @paste.prevent
              />
              <v-text-field
                :type="showBack ? 'text' : 'password'"
                v-model="form.regno2"
                label="주민번호 뒷자리"
                inputmode="numeric"
                pattern="\d*"
                maxlength="7"
                :counter="7"
                :rules="[rules.len7, rules.digits]"
                :append-inner-icon="showBack ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showBack = !showBack"
                autocomplete="new-password"
                variant="outlined"
                density="comfortable"
                @paste.prevent
                @copy.prevent
                @cut.prevent
              />
            </v-col>
            </v-row>
            <v-row class="w-75 mx-auto">
            <!-- 비밀번호 변경 섹션 토글 -->
            <v-col cols="12">
              <v-expand-transition>
                <div v-if="!pwStepOpen" class="d-flex align-center ga-2">
                  <v-btn size="small" variant="outlined" @click="openPwStep">비밀번호 변경</v-btn>
                  <span class="text-medium-emphasis text-caption">변경하지 않으면 공란으로 두세요.</span>
                </div>
              </v-expand-transition>

              <v-expand-transition>
                <div v-if="pwStepOpen" class="d-flex flex-column ga-2">
                  <!-- 1단계: 현재 비밀번호 확인 (UI만, 실제 검증 API 명세 없음) -->
                  <div v-if="pwStep === 1" class="d-flex ga-2 align-center">
                    <v-text-field
                      v-model="currentPw"
                      label="현재 비밀번호"
                      type="password"
                      variant="outlined"
                      density="comfortable"
                      style="max-width: 280px"
                    />
                    <v-btn size="small" @click="cancelPw">취소</v-btn>
                    <v-btn size="small" color="primary" @click="confirmPwStep">확인</v-btn>
                  </div>

                  <!-- 2단계: 신규 비밀번호 입력 -->
                  <div v-else class="d-flex ga-2 align-center">
                    <v-text-field
                      v-model="form.userPw"
                      label="* 신규 비밀번호"
                      type="password"
                      :rules="[rules.minPw]"
                      variant="outlined"
                      density="comfortable"
                      autocomplete="new-password"
                      style="max-width: 280px"
                    />
                    <v-text-field
                      v-model="userPwRe"
                      label="* 비밀번호 확인"
                      type="password"
                      :rules="[v => v === form.userPw || '비밀번호가 일치하지 않습니다.']"
                      variant="outlined"
                      density="comfortable"
                      autocomplete="new-password"
                      style="max-width: 280px"
                    />
                    <v-btn size="small" @click="cancelPw">취소</v-btn>
                  </div>
                </div>
              </v-expand-transition>
            </v-col>
            </v-row>
            <v-row class="w-75 mx-auto">
            <!-- 프로필 사진: 미리보기 + 파일선택 + 삭제 -->
            <v-col cols="12" md="6">
              <div class="mb-2 text-medium-emphasis">프로필 사진</div>
              <div class="image-preview mb-2">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="미리보기"
                  style="max-width:300px; max-height:210px; object-fit:contain"
                />
                <div v-else class="text-medium-emphasis d-flex align-center" style="width:300px;height:210px;justify-content:center;">
                  미리보기 없음
                </div>
              </div>
              <div class="d-flex ga-2">
                <v-file-input
                  v-model="profileFile"
                  label="이미지 선택 (.jpg .png .webp)"
                  accept=".jpg,.jpeg,.png,.webp"
                  variant="outlined"
                  density="comfortable"
                  prepend-icon="mdi-image"
                  @change="onPickFile"
                  style="max-width: 420px"
                />
                <v-btn size="small" variant="outlined" @click="deleteProfileImage">이미지 삭제</v-btn>
              </div>
              <div class="text-caption text-medium-emphasis mt-1">
                이미지 업로드/삭제 REST API 필요
              </div>
            </v-col>

            <!-- 사용자 권한 -->
            <v-col cols="12">
              <div class="mb-2 text-medium-emphasis">사용자 권한</div>
              <div class="d-flex flex-wrap gap-4">
                <v-checkbox
                  v-for="code in cmmnCodeList"
                  :key="code.cmmnCd"
                  v-model="form.userRoles"
                  :label="code.cmmnNm"
                  :value="code.cmmnCd"
                  density="comfortable"
                  hide-details
                />
              </div>
            </v-col>

            <!-- 버튼 -->
            <v-col cols="12" class="d-flex ga-2">
              <v-btn type="submit" color="primary" :loading="submitting">수정</v-btn>
              <v-btn variant="outlined" @click="onReset">초기화</v-btn>
              <v-btn variant="outlined" color="error" @click="goDetailOrList">취소</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
/**
 * REST API
 * - 사용자 상세 GET:   /user-management/users/{userId}                   → Envelope<UserVO>
 * - 권한 목록 GET:     /cmmn-management/user-role/{userId}               → Envelope<List<UserRoleVO>>
 * - 공통코드 GET:      /cmmn-management/code/AA                          → Envelope<List<CommonCodeVO>>
 * - 사용자 수정 PUT:   /user-management/users/{userId}?username=         → Envelope<UserVO>
 * - 권한 병합 POST:    /cmmn-management/user-role/{userId}?username=     (body: List<String>)
 *
 * 주의:
 * - 비밀번호는 선택 입력. 공란이면 전송하지 않음.
 * - 이미지 업로드/삭제는 명세 없음 → 미리보기만, 삭제 버튼은 TODO로 남김.
 */
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const axios = inject('axios')
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)
const errorMsg = ref('')

const form = ref({
  userNm: '',
  regno1: '',
  regno2: '',
  userPw: '',        // 선택 입력
  userRoles: []      // List<String>
})

const original = ref(null)        // 초기 스냅샷
const cmmnCodeList = ref([])
const profileFile = ref(null)
const previewUrl = ref('')
const showBack = ref(false)

// 비밀번호 단계 UI
const pwStepOpen = ref(false)
const pwStep = ref(1)   // 1: 현재 비번 확인, 2: 신규입력
const currentPw = ref('')
const userPwRe = ref('')

function openPwStep() { pwStepOpen.value = true; pwStep.value = 1 }
function cancelPw()   { pwStepOpen.value = false; pwStep.value = 1; form.value.userPw=''; userPwRe.value=''; currentPw.value='' }
function confirmPwStep() { pwStep.value = 2 } // 실제 검증 API 명세 없음

const rules = {
  required: v => !!String(v ?? '').trim() || '필수 입력입니다.',
  digits: v => /^\d*$/.test(String(v ?? '')) || '숫자만 입력하세요.',
  len6: v => !v || String(v).length === 6 || '앞자리는 6자리',
  len7: v => !v || String(v).length === 7 || '뒷자리는 7자리',
  minPw: v => !v || String(v).length >= 6 || '비밀번호는 6자 이상'
}

function getUserId() {
  return route.query.userId ?? route.params.userId ?? route.params.id ?? route.query.id
}
const userId = getUserId()

function onPickFile() {
  const file = Array.isArray(profileFile.value) ? profileFile.value[0] : profileFile.value
  if (!file) { previewUrl.value = ''; return }
  const reader = new FileReader()
  reader.onload = e => { previewUrl.value = e.target?.result || '' }
  reader.readAsDataURL(file)
}

function onReset() {
  if (!original.value) return
  form.value = {
    userNm: original.value.userNm ?? '',
    regno1: original.value.regno1 ?? '',
    regno2: original.value.regno2 ?? '',
    userPw: '',
    userRoles: [...(original.value.userRoles || [])]
  }
  profileFile.value = null
  previewUrl.value = ''
  cancelPw()
  formRef.value?.resetValidation?.()
}

function goDetailOrList() {
  // 상세 라우트가 있으면 상세로, 없으면 목록으로
  try {
    router.push({ name: 'user-detail', query: { userId } })
  } catch {
    router.push({ name: 'users' })
  }
}

async function loadAll() {
  errorMsg.value = ''
  if (!userId) { errorMsg.value = 'userId가 없습니다.'; return }
  try {
    const [userRes, rolesRes, codesRes] = await Promise.all([
      axios.get(`/user-management/users/${userId}`),
      axios.get(`/cmmn-management/user-role/${userId}`),
      axios.get(`/cmmn-management/code/AA`)
    ])

    const user = userRes.data?.data ?? userRes.data ?? null
    const roleList = rolesRes.data?.data ?? rolesRes.data ?? []
    cmmnCodeList.value = codesRes.data?.data ?? codesRes.data ?? []

    // 폼에 주입
    form.value.userNm = user?.userNm ?? ''
    form.value.regno1 = user?.regno1 ?? ''
    form.value.regno2 = user?.regno2 ?? ''
    form.value.userRoles = roleList.map(r => r.userRole)

    // 원본 스냅샷
    original.value = {
      userNm: form.value.userNm,
      regno1: form.value.regno1,
      regno2: form.value.regno2,
      userRoles: [...form.value.userRoles]
    }

    // 프로필 미리보기 초기화: 서버 이미지 src가 필요하면 여기서 set
    previewUrl.value = '' // 명세 없으니 공란
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || '상세 정보를 불러오는 중 오류가 발생했습니다.'
    // eslint-disable-next-line no-console
    console.error('UPDATE_LOAD_ERR', { msg: e.message, status: e.response?.status, data: e.response?.data })
  }
}

async function onSubmit() {
  const valid = await formRef.value?.validate?.()
  if (valid === false || valid?.valid === false) return

  submitting.value = true
  try {
    // PUT 페이로드 구성: 공란 비번은 제외
    const payload = {
      userNm: form.value.userNm,
      regno1: form.value.regno1 || null,
      regno2: form.value.regno2 || null
    }
    if (form.value.userPw?.trim()) {
      payload.userPw = form.value.userPw.trim()
    }

    // 사용자 수정
    await axios.put(`/user-management/users/${userId}`, payload, {
      params: { username: '' } // 서비스 시그니처상 필요. 실제 로그인 사용자 전달하면 교체
    })

    // 권한 병합
    await axios.post(`/cmmn-management/user-role/${userId}`, form.value.userRoles || [], {
      params: { username: '' }
    })

    goDetailOrList()
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || '수정 중 오류가 발생했습니다.'
    // eslint-disable-next-line no-console
    console.error('USER_UPDATE_ERR', { msg: e.message, status: e.response?.status, data: e.response?.data })
  } finally {
    submitting.value = false
  }
}

async function deleteProfileImage() {
  // TODO: 이미지 삭제 REST 엔드포인트 명세 필요.
  // 예: await axios.delete(`/user-management/users/${userId}/profile`, { params: { username: '' } })
  profileFile.value = null
  previewUrl.value = ''
}

onMounted(loadAll)

// 뒤/앞 이동으로 userId가 바뀌는 경우 대응
watch(() => [route.query.userId, route.params.id, route.params.userId], ([q1, p1, p2]) => {
  const nextId = q1 ?? p1 ?? p2
  if (nextId && nextId !== userId) {
    // 단순 재진입 시엔 전체 리로드가 더 안전
    router.replace({ name: route.name, query: { userId: nextId } })
  }
})
</script>

<style scoped>
.image-preview {
  width: 300px;
  height: 210px;
  display: flex;
  justify-content: center;
}
</style>
