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
 *  2025-10-11      KCY             스크립트 작성
 *  2025-10-12      KCY             form inputs 검증 UX 구현
 *  2025-10-13      KCY             불필요 코드 수정
-->
<template>
  <v-container>
    <v-card class="shadow-sm">
        <v-card-title class="d-flex align-center">
            <!-- <div class="text-h6">신규 사용자 등록</div> -->
            <v-spacer />
            <v-btn variant="text" size="small" @click="goList">목록</v-btn>
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
                <!-- 사용자 ID -->
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="form.userId"
                    label="* 사용자 ID"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    />
                </v-col>
                </v-row>
                <v-row class="w-75 mx-auto">
                <!-- 사용자 PW -->
                <v-col cols="12" md="6">
                    <v-text-field
                    v-model="form.userPw"
                    type="password"
                    label="* 사용자 PW"
                    :rules="[rules.required, rules.minPw]"
                    variant="outlined"
                    density="comfortable"
                    clearable
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
                    type="text"
                    inputmode="numeric"
                    variant="outlined"
                    density="comfortable"
                    maxlength="6"
                    />
                <v-text-field
                v-model="form.regno2"
                label="주민번호 뒷자리"
                type="password"
                inputmode="numeric"
                variant="outlined"
                density="comfortable"
                maxlength="7"
                />
                </v-col>
                </v-row>
                <v-row class="w-75 mx-auto">
                <!-- 프로필 사진 (미리보기만, 업로드 전송은 보류) -->
                <v-col cols="12" md="6">
                <div class="mb-2 text-medium-emphasis">프로필 사진 (미리보기만)</div>
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
                <v-file-input
                v-model="profileFile"
                label="프로필 이미지 선택 (.jpg, .png, .webp)"
                accept=".jpg,.jpeg,.png,.webp"
                variant="outlined"
                density="comfortable"
                prepend-icon="mdi-image"
                @change="onPickFile"
                />
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

                <!-- 버튼 그룹 -->
                <v-col cols="12" class="d-flex gap-2">
                <v-btn type="submit" color="primary" :loading="submitting">등록</v-btn>
                <v-btn variant="outlined" @click="onReset">초기화</v-btn>
                <v-btn variant="outlined" color="error" @click="onCancel">취소</v-btn>
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
 * - 공통코드:          GET /cmmn-management/code/AA    → Envelope<List<CommonCodeVO>>{data:[{cmmnCd,cmmnNm,...}]}
 * - 사용자 생성:       POST /user-management/users     → Envelope<UserVO>{data:{...}}
 * - 사용자 권한:         POST /cmmn-management/user-role/{userId}?username=  (body: List<String>)
 */
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const axios = inject('axios')
const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)
const errorMsg = ref('')

const form = ref({
    userId: '',
    userPw: '',
    userNm: '',
    regno1: '',
    regno2: '',
    userRoles: [],        // List<String>
    // profileGrpId: null
})

const profileFile = ref(null)
const previewUrl = ref('')

const cmmnCodeList = ref([]) // 권한 코드 목록

const rules = {
    required: v => !!(v && String(v).trim()) || '필수 입력입니다.',
    minPw: v => (v?.length ?? 0) >= 6 || '비밀번호는 6자 이상'
}

function onReset() {
    form.value = { userId:'', userPw:'', userNm:'', regno1:'', regno2:'', userRoles: [] }
    profileFile.value = null
    previewUrl.value = ''
    formRef.value?.resetValidation?.()
}

function onCancel() {
    onReset()
    goList()
}

function onPickFile() {
    const file = Array.isArray(profileFile.value) ? profileFile.value[0] : profileFile.value
    if (!file) { previewUrl.value = ''; return }
    const reader = new FileReader()
    reader.onload = e => { previewUrl.value = e.target?.result || '' }
    reader.readAsDataURL(file)
}

function goList() {
    router.push({ name: 'dashboard' })
}

async function loadCodes() {
    const { data } = await axios.get('/cmmn-management/code/AA')
    cmmnCodeList.value = data?.data ?? data ?? []
}

async function onSubmit() {
    errorMsg.value = ''
    const valid = await formRef.value?.validate?.()
    if (valid === false || valid?.valid === false) return

    submitting.value = true
    try {
        // 1) UserApi
        const payload = {
        userId: form.value.userId,
        userPw: form.value.userPw,
        userNm: form.value.userNm,
        regno1: form.value.regno1 || null,
        regno2: form.value.regno2 || null,
        // profileGrpId: form.value.profileGrpId || null
        }

        const createRes = await axios.post('/user-management/users', payload)
        const created = createRes.data?.data ?? createRes.data
        const createdUserId = created?.userId

        // 2) UserRoleApi
        if (createdUserId && form.value.userRoles?.length) {
        await axios.post(`/cmmn-management/user-role/${createdUserId}`, form.value.userRoles, {
            params: { username: '' }
        })
        }

        // 완료 후 목록으로
        goList()
    } catch (e) {
        errorMsg.value = e?.response?.data?.message || '등록 중 오류가 발생했습니다.'
        // eslint-disable-next-line no-console
        console.error('USER_INSERT_ERR', {
        msg: e.message,
        status: e.response?.status,
        data: e.response?.data
        })
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    await loadCodes()
})
</script>

<style scoped>
.image-preview {
  width: 300px;
  height: 210px;
  display: flex;
  justify-content: center;
}
.password-mask {
  -webkit-text-security: disc; /* Chrome/Edge/Safari */
  text-security: disc;         /* 일부 브라우저 실험적 */
}
</style>

